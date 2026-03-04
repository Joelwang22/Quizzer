import type { Choice, Question, Topic } from '../models';

interface PdfTextItemLike {
  str: string;
  transform: ArrayLike<number>;
}

interface PdfTextContentLike {
  items: unknown[];
}

interface PdfPageLike {
  getTextContent: () => Promise<PdfTextContentLike>;
}

interface PdfDocumentLike {
  numPages: number;
  getPage: (pageNumber: number) => Promise<PdfPageLike>;
}

interface PdfLoadingTaskLike {
  promise: Promise<PdfDocumentLike>;
}

interface PdfJsLike {
  GlobalWorkerOptions: { workerSrc: string };
  getDocument: (options: { data: Uint8Array; disableWorker?: boolean }) => PdfLoadingTaskLike;
}

export interface PracticeExamPdfImportProgress {
  page: number;
  totalPages: number;
}

export interface PracticeExamPdfImportResult {
  questions: Question[];
  requiredTopics: Topic[];
  warnings: string[];
  duplicateCount: number;
}

export type PracticeExamPdfImportSectionScope = 'all' | 'chapters';

interface SectionMeta {
  sectionKey: string;
  topicId: string;
  topicName: string;
}

const SOURCE_SLUG = 'examsdigest-sy0701';

const normaliseWhitespace = (value: string): string =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normalisePunctuationSpacing = (value: string): string => value.replace(/\s+([,.;:!?])/g, '$1');

const normaliseForFingerprint = (value: string): string =>
  normaliseWhitespace(
    value
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' '),
  );

const fingerprintMcq = (stem: string, choices: Choice[], correctChoiceIds: string[]): string => {
  const stemKey = normaliseForFingerprint(stem);
  const choiceKeys = choices.map((choice) => normaliseForFingerprint(choice.text)).sort();
  const correctKeys = correctChoiceIds
    .map((choiceId) => choices.find((choice) => choice.id === choiceId)?.text ?? choiceId)
    .map((value) => normaliseForFingerprint(value))
    .sort();

  return [`stem:${stemKey}`, `choices:${choiceKeys.join('|')}`, `answers:${correctKeys.join('|')}`].join('||');
};

const isPdfTextItemLike = (value: unknown): value is PdfTextItemLike => {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const record = value as Record<string, unknown>;
  if (typeof record.str !== 'string') {
    return false;
  }

  const transformValue = record.transform;
  if (!transformValue || (typeof transformValue !== 'object' && typeof transformValue !== 'function')) {
    return false;
  }

  const lengthValue = (transformValue as { length?: unknown }).length;
  if (typeof lengthValue !== 'number' || lengthValue < 6) {
    return false;
  }

  const transform = transformValue as ArrayLike<unknown>;
  for (let index = 0; index < 6; index += 1) {
    const entry = transform[index];
    if (typeof entry !== 'number' || !Number.isFinite(entry)) {
      return false;
    }
  }

  return true;
};

type PositionedItem = { text: string; x: number; y: number };

const groupIntoLines = (items: PositionedItem[], tolerance = 2): PositionedItem[][] => {
  const sorted = [...items].sort((a, b) => {
    if (b.y !== a.y) {
      return b.y - a.y;
    }
    return a.x - b.x;
  });

  const lines: PositionedItem[][] = [];
  let currentLine: PositionedItem[] = [];
  let currentY = Number.NaN;

  for (const item of sorted) {
    if (currentLine.length === 0) {
      currentLine = [item];
      currentY = item.y;
      continue;
    }

    if (Math.abs(item.y - currentY) <= tolerance) {
      currentLine.push(item);
      continue;
    }

    lines.push(currentLine.sort((a, b) => a.x - b.x));
    currentLine = [item];
    currentY = item.y;
  }

  if (currentLine.length > 0) {
    lines.push(currentLine.sort((a, b) => a.x - b.x));
  }

  return lines;
};

const extractPageLines = (items: unknown[]): string[] => {
  const positioned: PositionedItem[] = [];

  for (const item of items) {
    if (!isPdfTextItemLike(item)) {
      continue;
    }
    const xRaw = item.transform[4];
    const yRaw = item.transform[5];
    const x = typeof xRaw === 'number' ? xRaw : 0;
    const y = typeof yRaw === 'number' ? yRaw : 0;
    positioned.push({ text: item.str, x, y });
  }

  const lines = groupIntoLines(positioned);
  return lines
    .map((line) => normalisePunctuationSpacing(normaliseWhitespace(line.map((entry) => entry.text).join(' '))))
    .filter((line) => line.length > 0);
};

const parseRangeKey = (line: string, label: 'Answers' | 'Questions'): string | null => {
  const match = new RegExp(`^${label}\\s+(\\d+)\\s*-\\s*(\\d+)\\b`, 'i').exec(line);
  if (!match) {
    return null;
  }
  const start = match[1];
  const end = match[2];
  if (!start || !end) {
    return null;
  }
  return `${start}-${end}`;
};

const knownSectionsByAnswerRange: Record<string, SectionMeta> = {
  '1-110': {
    sectionKey: 'chapter-1',
    topicId: 'general-security-concepts',
    topicName: 'General Security Concepts',
  },
  '111-220': {
    sectionKey: 'chapter-2',
    topicId: 'threats-attacks',
    topicName: 'Threats, Attacks & Vulnerabilities',
  },
  '221-310': {
    sectionKey: 'chapter-3',
    topicId: 'implementation',
    topicName: 'Implementation',
  },
  '311-460': {
    sectionKey: 'chapter-4',
    topicId: 'operations',
    topicName: 'Operations & Incident Response',
  },
  '461-540': {
    sectionKey: 'chapter-5',
    topicId: 'governance',
    topicName: 'Governance, Risk & Compliance',
  },
  '1-100': {
    sectionKey: 'exam-sim-1',
    topicId: 'examsdigest-exam-simulator-1',
    topicName: 'Exam Simulator #1',
  },
  '101-200': {
    sectionKey: 'exam-sim-2',
    topicId: 'examsdigest-exam-simulator-2',
    topicName: 'Exam Simulator #2',
  },
  '201-300': {
    sectionKey: 'exam-sim-3',
    topicId: 'examsdigest-exam-simulator-3',
    topicName: 'Exam Simulator #3',
  },
  '301-400': {
    sectionKey: 'exam-sim-4',
    topicId: 'examsdigest-exam-simulator-4',
    topicName: 'Exam Simulator #4',
  },
  '401-500': {
    sectionKey: 'answers-401-500',
    topicId: 'examsdigest-answers-401-500',
    topicName: 'Exam Simulator #5',
  },
  '501-600': {
    sectionKey: 'answers-501-600',
    topicId: 'examsdigest-answers-501-600',
    topicName: 'Exam Simulator #6',
  },
};

const getSectionForAnswerRange = (rangeKey: string): SectionMeta => {
  const known = knownSectionsByAnswerRange[rangeKey];
  if (known) {
    return known;
  }

  const safeRange = rangeKey.replace(/[^0-9-]/g, '');
  return {
    sectionKey: `answers-${safeRange || 'unknown'}`,
    topicId: `examsdigest-answers-${safeRange || 'unknown'}`,
    topicName: `Answers ${rangeKey}`,
  };
};

interface DraftQuestion {
  number: number;
  stemParts: string[];
  choices: Map<string, string[]>;
  activeChoice: string | null;
  explanationHeaderNumber: number | null;
  explanationParts: string[];
  correctLetters: string[] | null;
  inExplanation: boolean;
}

const parseQuestionNumber = (line: string): { number: number; rest: string } | null => {
  const match = /^\W*Question\s+(\d+)\.?\s*(.*)$/i.exec(line);
  if (!match) {
    return null;
  }

  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }

  return { number: value, rest: match[2] ?? '' };
};

const parseChoiceLine = (line: string): { letter: string; rest: string } | null => {
  const match = /^\(([A-H])\)\s*(.*)$/i.exec(line);
  if (!match) {
    return null;
  }

  const letter = match[1]?.toUpperCase();
  if (!letter) {
    return null;
  }

  return { letter, rest: match[2] ?? '' };
};

const parseExplanationHeader = (line: string): { number: number; rest: string } | null => {
  const match = /^\W*Explanation\s+(\d+)\.?\s*(.*)$/i.exec(line);
  if (!match) {
    return null;
  }
  const value = Number(match[1]);
  if (!Number.isFinite(value) || value <= 0) {
    return null;
  }
  return { number: value, rest: match[2] ?? '' };
};

const parseCorrectAnswerLetters = (line: string): string[] | null => {
  const match = /Correct Answer(?:s)?:\s*([A-H](?:\s*(?:,|and)\s*[A-H])*)/i.exec(line);
  if (!match) {
    return null;
  }

  const raw = match[1] ?? '';
  const normalized = raw.replace(/\band\b/gi, ',');
  const letters = normalized
    .split(',')
    .map((part) => part.trim().toUpperCase())
    .filter((part) => /^[A-H]$/.test(part));

  return letters.length > 0 ? Array.from(new Set(letters)) : null;
};

const createImportedQuestionId = (sectionKey: string, questionNumber: number): string => {
  const padded = String(questionNumber).padStart(4, '0');
  return `imp-${SOURCE_SLUG}-${sectionKey}-${padded}`;
};

export class PracticeExamPdfQuestionParser {
  private mode: 'none' | 'questions' | 'answers' = 'none';
  private currentSection: SectionMeta | null = null;
  private currentQuestion: DraftQuestion | null = null;
  private lastSavedQuestionNumber: number | null = null;
  private readonly questionsById = new Map<string, Question>();
  private readonly questionIdByFingerprint = new Map<string, string>();
  private readonly requiredTopicsById = new Map<string, Topic>();
  private readonly warnings: string[] = [];
  private readonly nowIso: string;
  private duplicateCount = 0;
  private readonly sectionScope: PracticeExamPdfImportSectionScope;

  constructor(
    private readonly subjectId: string,
    options?: {
      sectionScope?: PracticeExamPdfImportSectionScope;
    },
  ) {
    this.nowIso = new Date().toISOString();
    this.sectionScope = options?.sectionScope ?? 'all';
  }

  private ensureTopic(topicId: string, topicName: string): void {
    if (!this.requiredTopicsById.has(topicId)) {
      this.requiredTopicsById.set(topicId, { id: topicId, subjectId: this.subjectId, name: topicName });
    }
  }

  private flushQuestion(nextQuestionNumber?: number): void {
    const draft = this.currentQuestion;
    const section = this.currentSection;
    this.currentQuestion = null;

    if (!draft || !section) {
      return;
    }

    if (draft.explanationHeaderNumber !== null && draft.explanationHeaderNumber !== draft.number) {
      const observed = draft.explanationHeaderNumber;
      const expected = draft.number;
      const expectedDigits = String(expected);
      const observedDigits = String(observed);

      const missingLeadingDigits =
        observedDigits.length < expectedDigits.length && expectedDigits.endsWith(observedDigits);

      const offByOneForward =
        typeof nextQuestionNumber === 'number' && observed === nextQuestionNumber && nextQuestionNumber === expected + 1;

      const repeatsPrevious =
        this.lastSavedQuestionNumber !== null && observed === this.lastSavedQuestionNumber && observed === expected - 1;

      if (!missingLeadingDigits && !offByOneForward && !repeatsPrevious) {
        this.warnings.push(
          `Explanation ${observed} encountered while parsing question ${expected} (${section.sectionKey}).`,
        );
      }
    }

    const stem = normaliseWhitespace(draft.stemParts.join(' '));
    if (!stem) {
      this.warnings.push(`Skipped question ${draft.number} (empty stem).`);
      return;
    }

    const choiceEntries = Array.from(draft.choices.entries())
      .map(([letter, parts]) => ({
        letter,
        text: normaliseWhitespace(parts.join(' ')),
      }))
      .filter((entry) => entry.text.length > 0)
      .sort((a, b) => a.letter.localeCompare(b.letter));

    if (choiceEntries.length < 2) {
      this.warnings.push(`Skipped question ${draft.number} (found ${choiceEntries.length} choices).`);
      return;
    }

    const correctLetters = draft.correctLetters ?? [];
    if (correctLetters.length === 0) {
      this.warnings.push(`Skipped question ${draft.number} (missing correct answer).`);
      return;
    }

    const choices: Choice[] = choiceEntries.map((entry) => ({
      id: entry.letter.toLowerCase(),
      text: entry.text,
    }));

    const correctChoiceIds = correctLetters.map((letter) => letter.toLowerCase());
    const missingChoices = correctChoiceIds.filter((choiceId) => !choices.some((choice) => choice.id === choiceId));
    if (missingChoices.length > 0) {
      this.warnings.push(
        `Question ${draft.number} has answer ${missingChoices.join(', ')} not present in choices (${section.sectionKey}).`,
      );
    }

    const questionId = createImportedQuestionId(section.sectionKey, draft.number);
    const explanation = normaliseWhitespace(draft.explanationParts.join(' ')) || undefined;
    const type: Question['type'] = correctChoiceIds.length > 1 ? 'mcq_multi' : 'mcq_single';

    const fingerprint = fingerprintMcq(stem, choices, correctChoiceIds);
    const existingId = this.questionIdByFingerprint.get(fingerprint);
    if (existingId) {
      const existing = this.questionsById.get(existingId);
      if (existing) {
        const nextTopics = existing.topicIds.includes(section.topicId)
          ? existing.topicIds
          : [...existing.topicIds, section.topicId];

        const nextExplanation =
          explanation && (!existing.explanation || explanation.length > existing.explanation.length)
            ? explanation
            : existing.explanation;

        this.questionsById.set(existingId, {
          ...existing,
          topicIds: nextTopics,
          explanation: nextExplanation,
          updatedAt: this.nowIso,
        });
      }
      this.duplicateCount += 1;
      this.lastSavedQuestionNumber = draft.number;
      return;
    }

    this.questionIdByFingerprint.set(fingerprint, questionId);

    this.questionsById.set(questionId, {
      id: questionId,
      subjectId: this.subjectId,
      topicIds: [section.topicId],
      type,
      stem,
      choices,
      correctChoiceIds,
      explanation,
      createdAt: this.nowIso,
      updatedAt: this.nowIso,
    });

    this.lastSavedQuestionNumber = draft.number;
  }

  consumeLine(rawLine: string): void {
    const line = normalisePunctuationSpacing(normaliseWhitespace(rawLine));
    if (!line) {
      return;
    }

    if (/^\d{1,4}$/.test(line)) {
      return;
    }

    const answerRange = parseRangeKey(line, 'Answers');
    if (answerRange) {
      this.flushQuestion();
      this.lastSavedQuestionNumber = null;
      const section = getSectionForAnswerRange(answerRange);

      if (this.sectionScope === 'chapters' && !section.sectionKey.startsWith('chapter-')) {
        this.currentSection = null;
        this.mode = 'none';
        return;
      }

      this.currentSection = section;
      this.ensureTopic(section.topicId, section.topicName);
      this.mode = 'answers';
      return;
    }

    const questionRange = parseRangeKey(line, 'Questions');
    if (questionRange) {
      this.flushQuestion();
      this.mode = 'questions';
      return;
    }

    if (this.mode !== 'answers') {
      return;
    }

    const questionHeader = parseQuestionNumber(line);
    if (questionHeader) {
      this.flushQuestion(questionHeader.number);
      this.currentQuestion = {
        number: questionHeader.number,
        stemParts: questionHeader.rest ? [questionHeader.rest] : [],
        choices: new Map<string, string[]>(),
        activeChoice: null,
        explanationHeaderNumber: null,
        explanationParts: [],
        correctLetters: null,
        inExplanation: false,
      };
      return;
    }

    const current = this.currentQuestion;
    if (!current) {
      return;
    }

    const choiceLine = parseChoiceLine(line);
    if (choiceLine && !current.inExplanation) {
      current.activeChoice = choiceLine.letter;
      current.choices.set(choiceLine.letter, choiceLine.rest ? [choiceLine.rest] : []);
      return;
    }

    const explanationHeader = parseExplanationHeader(line);
    if (explanationHeader) {
      current.activeChoice = null;
      current.inExplanation = true;

      if (current.explanationHeaderNumber === null) {
        current.explanationHeaderNumber = explanationHeader.number;
      }

      const rest = normaliseWhitespace(explanationHeader.rest);
      if (rest) {
        const correctLetters = parseCorrectAnswerLetters(rest);
        if (correctLetters && !current.correctLetters) {
          current.correctLetters = correctLetters;
        }
        current.explanationParts.push(rest);
      }
      return;
    }

    if (current.inExplanation) {
      const correctLetters = parseCorrectAnswerLetters(line);
      if (correctLetters && !current.correctLetters) {
        current.correctLetters = correctLetters;
      }
      current.explanationParts.push(line);
      return;
    }

    if (current.activeChoice) {
      const existing = current.choices.get(current.activeChoice) ?? [];
      existing.push(line);
      current.choices.set(current.activeChoice, existing);
      return;
    }

    current.stemParts.push(line);
  }

  finalize(): PracticeExamPdfImportResult {
    this.flushQuestion();
    return {
      questions: Array.from(this.questionsById.values()),
      requiredTopics: Array.from(this.requiredTopicsById.values()),
      warnings: this.warnings,
      duplicateCount: this.duplicateCount,
    };
  }
}

export const importPracticeExamQuestionsFromPdfArrayBuffer = async (
  data: ArrayBuffer,
  subjectId: string,
  options?: {
    onProgress?: (progress: PracticeExamPdfImportProgress) => void;
    sectionScope?: PracticeExamPdfImportSectionScope;
  },
): Promise<PracticeExamPdfImportResult> => {
  const pdfjs = (await import('pdfjs-dist')) as unknown as PdfJsLike;
  const workerUrl = (await import('pdfjs-dist/build/pdf.worker.min.mjs?url')).default;

  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const binary = new Uint8Array(data);

  const load = async (disableWorker?: boolean): Promise<PracticeExamPdfImportResult> => {
    const loadingTask = pdfjs.getDocument({ data: binary, disableWorker });
    const document = await loadingTask.promise;
    const parser = new PracticeExamPdfQuestionParser(subjectId, { sectionScope: options?.sectionScope });

    for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
      const page = await document.getPage(pageNumber);
      const content = await page.getTextContent();
      const items = Array.isArray(content.items) ? content.items : [];
      const lines = extractPageLines(items);
      lines.forEach((line) => parser.consumeLine(line));

      options?.onProgress?.({ page: pageNumber, totalPages: document.numPages });

      if (pageNumber % 20 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    return parser.finalize();
  };

  try {
    return await load(false);
  } catch (error) {
    return await load(true).catch(() => {
      throw error;
    });
  }
};
