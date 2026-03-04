import type { Attempt, Question, Test, TestAttemptAnswer } from '../models';
import { isMCQ } from '../models';
import { fingerprintQuestion, mapChoiceIdsByText } from './questionFingerprint';

interface RedirectInfo {
  canonicalId: string;
  choiceIdMap?: Map<string, string>;
}

export interface QuestionBankDeduplicationPlan {
  duplicateGroups: number;
  questionsToPut: Question[];
  questionIdsToDelete: string[];
  testsToPut: Test[];
  attemptsToPut: Attempt[];
}

const isImportedQuestionId = (questionId: string): boolean => questionId.startsWith('imp-');

const parseIsoTime = (value: string | undefined): number | null => {
  if (!value) {
    return null;
  }
  const ms = Date.parse(value);
  return Number.isFinite(ms) ? ms : null;
};

const pickEarliestIso = (values: Array<string | undefined>): string | undefined => {
  let best: string | undefined;
  let bestMs: number | null = null;

  for (const value of values) {
    const ms = parseIsoTime(value);
    if (ms === null) {
      continue;
    }
    if (bestMs === null || ms < bestMs) {
      bestMs = ms;
      best = value;
    }
  }

  return best;
};

const pickLongest = (values: Array<string | undefined>): string | undefined => {
  let best: string | undefined;
  let bestLen = 0;

  for (const value of values) {
    const trimmed = value?.trim();
    if (!trimmed) {
      continue;
    }
    if (!best || trimmed.length > bestLen) {
      best = trimmed;
      bestLen = trimmed.length;
    }
  }

  return best;
};

const mergeTopicIds = (primary: string[], additional: string[]): string[] => {
  const seen = new Set(primary);
  const merged = [...primary];

  for (const topicId of additional) {
    if (seen.has(topicId)) {
      continue;
    }
    seen.add(topicId);
    merged.push(topicId);
  }

  return merged;
};

const chooseCanonicalQuestion = (group: Question[]): Question => {
  return [...group].sort((a, b) => {
    const importedA = isImportedQuestionId(a.id);
    const importedB = isImportedQuestionId(b.id);
    if (importedA !== importedB) {
      return importedA ? 1 : -1;
    }

    const createdA = parseIsoTime(a.createdAt);
    const createdB = parseIsoTime(b.createdAt);
    if (createdA !== null && createdB !== null && createdA !== createdB) {
      return createdA - createdB;
    }
    if (createdA !== null && createdB === null) {
      return -1;
    }
    if (createdA === null && createdB !== null) {
      return 1;
    }

    return a.id.localeCompare(b.id);
  })[0]!;
};

const compareSubmittedAt = (a: string | undefined, b: string | undefined): number => {
  const aMs = parseIsoTime(a);
  const bMs = parseIsoTime(b);
  if (aMs !== null && bMs !== null) {
    return aMs - bMs;
  }
  if (aMs !== null && bMs === null) {
    return 1;
  }
  if (aMs === null && bMs !== null) {
    return -1;
  }
  return 0;
};

const pickPreferredAnswer = (current: TestAttemptAnswer, incoming: TestAttemptAnswer): TestAttemptAnswer => {
  const ordering = compareSubmittedAt(current.submittedAt, incoming.submittedAt);
  if (ordering < 0) {
    return incoming;
  }
  if (ordering > 0) {
    return current;
  }
  if (incoming.chosenChoiceIds && (!current.chosenChoiceIds || incoming.chosenChoiceIds.length > current.chosenChoiceIds.length)) {
    return incoming;
  }
  return current;
};

export const buildQuestionBankDeduplicationPlan = ({
  questions,
  tests,
  attempts,
  nowIso = new Date().toISOString(),
}: {
  questions: Question[];
  tests: Test[];
  attempts: Attempt[];
  nowIso?: string;
}): QuestionBankDeduplicationPlan => {
  const questionsByFingerprint = new Map<string, Question[]>();
  for (const question of questions) {
    const fingerprint = fingerprintQuestion(question);
    const existing = questionsByFingerprint.get(fingerprint) ?? [];
    existing.push(question);
    questionsByFingerprint.set(fingerprint, existing);
  }

  const redirects = new Map<string, RedirectInfo>();
  const mergedQuestions = new Map<string, Question>();
  const questionIdsToDelete: string[] = [];
  let duplicateGroups = 0;

  for (const group of questionsByFingerprint.values()) {
    if (group.length < 2) {
      continue;
    }

    duplicateGroups += 1;
    const canonical = chooseCanonicalQuestion(group);

    let mergedTopicIds = canonical.topicIds;
    for (const candidate of group) {
      if (candidate.id === canonical.id) {
        continue;
      }
      mergedTopicIds = mergeTopicIds(mergedTopicIds, candidate.topicIds);
    }

    const mergedExplanation = pickLongest(group.map((candidate) => candidate.explanation));
    const mergedDifficulty =
      canonical.difficulty ??
      group.map((candidate) => candidate.difficulty).find((value): value is NonNullable<Question['difficulty']> => value != null);
    const mergedCreatedAt = pickEarliestIso(group.map((candidate) => candidate.createdAt)) ?? canonical.createdAt;

    mergedQuestions.set(canonical.id, {
      ...canonical,
      topicIds: mergedTopicIds,
      explanation: mergedExplanation,
      difficulty: mergedDifficulty,
      createdAt: mergedCreatedAt,
      updatedAt: nowIso,
    });

    for (const candidate of group) {
      if (candidate.id === canonical.id) {
        continue;
      }

      const choiceIdMap =
        isMCQ(candidate) && isMCQ(canonical)
          ? mapChoiceIdsByText(candidate.choices, canonical.choices)
          : undefined;

      redirects.set(candidate.id, { canonicalId: canonical.id, choiceIdMap });
      questionIdsToDelete.push(candidate.id);
    }
  }

  if (questionIdsToDelete.length === 0) {
    return {
      duplicateGroups: 0,
      questionsToPut: [],
      questionIdsToDelete: [],
      testsToPut: [],
      attemptsToPut: [],
    };
  }

  const remapQuestionId = (questionId: string): string => redirects.get(questionId)?.canonicalId ?? questionId;

  const remapChoiceIds = (questionId: string, choiceIds: string[] | undefined): string[] | undefined => {
    if (!choiceIds) {
      return undefined;
    }
    const choiceIdMap = redirects.get(questionId)?.choiceIdMap;
    if (!choiceIdMap) {
      return choiceIds;
    }
    return choiceIds.map((choiceId) => choiceIdMap.get(choiceId) ?? choiceId);
  };

  const testsToPut: Test[] = [];
  for (const test of tests) {
    const remappedQuestionIds = test.questionIds.map(remapQuestionId);
    const uniqueQuestionIds: string[] = [];
    const seenQuestionIds = new Set<string>();
    for (const questionId of remappedQuestionIds) {
      if (seenQuestionIds.has(questionId)) {
        continue;
      }
      seenQuestionIds.add(questionId);
      uniqueQuestionIds.push(questionId);
    }

    const allowedIds = new Set(uniqueQuestionIds);
    const remappedAnswers = new Map<string, TestAttemptAnswer>();
    for (const [key, answer] of Object.entries(test.answers)) {
      const originalQuestionId = answer.questionId ?? key;
      const mappedQuestionId = remapQuestionId(originalQuestionId);
      if (!allowedIds.has(mappedQuestionId)) {
        continue;
      }
      const nextAnswer: TestAttemptAnswer = {
        ...answer,
        questionId: mappedQuestionId,
        chosenChoiceIds: remapChoiceIds(originalQuestionId, answer.chosenChoiceIds),
      };

      const existing = remappedAnswers.get(mappedQuestionId);
      remappedAnswers.set(mappedQuestionId, existing ? pickPreferredAnswer(existing, nextAnswer) : nextAnswer);
    }

    const answers: Record<string, TestAttemptAnswer> = {};
    for (const questionId of uniqueQuestionIds) {
      const answer = remappedAnswers.get(questionId);
      if (answer) {
        answers[questionId] = answer;
      }
    }

    const markedForReview: string[] = [];
    const seenMarked = new Set<string>();
    for (const markedId of test.markedForReview) {
      const mapped = remapQuestionId(markedId);
      if (!allowedIds.has(mapped) || seenMarked.has(mapped)) {
        continue;
      }
      seenMarked.add(mapped);
      markedForReview.push(mapped);
    }

    const oldCurrentId = test.questionIds[test.currentIndex];
    const mappedCurrent = oldCurrentId ? remapQuestionId(oldCurrentId) : uniqueQuestionIds[0];
    const nextIndex = mappedCurrent ? Math.max(0, uniqueQuestionIds.indexOf(mappedCurrent)) : 0;

    const score =
      test.status === 'completed'
        ? uniqueQuestionIds.length === 0
          ? 0
          : Math.round(
              (uniqueQuestionIds.filter((questionId) => answers[questionId]?.isCorrect).length / uniqueQuestionIds.length) *
                100,
            )
        : test.score;

    const nextTest: Test = {
      ...test,
      questionIds: uniqueQuestionIds,
      answers,
      markedForReview,
      currentIndex: nextIndex,
      score,
    };

    testsToPut.push(nextTest);
  }

  const attemptsToPut: Attempt[] = [];
  for (const attempt of attempts) {
    const mappedQuestionId = remapQuestionId(attempt.questionId);
    const remappedChoices = remapChoiceIds(attempt.questionId, attempt.chosenChoiceIds);
    if (mappedQuestionId === attempt.questionId && remappedChoices === attempt.chosenChoiceIds) {
      continue;
    }
    attemptsToPut.push({
      ...attempt,
      questionId: mappedQuestionId,
      chosenChoiceIds: remappedChoices,
    });
  }

  return {
    duplicateGroups,
    questionsToPut: Array.from(mergedQuestions.values()),
    questionIdsToDelete,
    testsToPut,
    attemptsToPut,
  };
};

