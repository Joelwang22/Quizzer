import type { Choice, Question } from '../models';
import { isMCQ } from '../models';

const normaliseWhitespace = (value: string): string =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const normaliseForFingerprint = (value: string): string =>
  normaliseWhitespace(
    value
      .normalize('NFKD')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' '),
  );

const stableStringify = (value: unknown): string => {
  if (value === null) {
    return 'null';
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(',')}]`;
  }

  switch (typeof value) {
    case 'string':
      return JSON.stringify(value);
    case 'number':
      return Number.isFinite(value) ? String(value) : JSON.stringify(value);
    case 'boolean':
      return value ? 'true' : 'false';
    case 'undefined':
      return 'undefined';
    case 'bigint':
      return `bigint:${value.toString()}`;
    case 'symbol':
      return 'symbol';
    case 'function':
      return 'function';
    case 'object': {
      const record = value as Record<string, unknown>;
      const keys = Object.keys(record).sort();
      const parts = keys.map((key) => `${JSON.stringify(key)}:${stableStringify(record[key])}`);
      return `{${parts.join(',')}}`;
    }
    default:
      return String(value);
  }
};

const fingerprintMcq = (stem: string, choices: Choice[], correctChoiceIds: string[]): string => {
  const stemKey = normaliseForFingerprint(stem);
  const choiceKeys = choices.map((choice) => normaliseForFingerprint(choice.text)).sort();
  const correctKeys = correctChoiceIds
    .map((choiceId) => choices.find((choice) => choice.id === choiceId)?.text ?? choiceId)
    .map((value) => normaliseForFingerprint(value))
    .sort();

  return [`stem:${stemKey}`, `choices:${choiceKeys.join('|')}`, `answers:${correctKeys.join('|')}`].join('||');
};

export const fingerprintQuestion = (question: Question): string => {
  const base = [`subject:${question.subjectId}`, `type:${question.type}`];

  if (isMCQ(question)) {
    base.push(fingerprintMcq(question.stem, question.choices, question.correctChoiceIds));
    return base.join('||');
  }

  const instructionsKey = normaliseForFingerprint(question.pbqSpec.instructions);
  const configurationKey = stableStringify(question.pbqSpec.configuration);
  base.push(`stem:${normaliseForFingerprint(question.stem)}`);
  base.push(`instructions:${instructionsKey}`);
  base.push(`configuration:${configurationKey}`);
  return base.join('||');
};

export const mapChoiceIdsByText = (
  fromChoices: Choice[],
  toChoices: Choice[],
): Map<string, string> => {
  const targetsByText = new Map<string, string[]>();
  for (const choice of toChoices) {
    const key = normaliseForFingerprint(choice.text);
    const existing = targetsByText.get(key) ?? [];
    existing.push(choice.id);
    targetsByText.set(key, existing);
  }

  const usedCounts = new Map<string, number>();
  const result = new Map<string, string>();

  for (const choice of fromChoices) {
    const key = normaliseForFingerprint(choice.text);
    const targets = targetsByText.get(key) ?? [];
    const used = usedCounts.get(key) ?? 0;
    const target = targets[used] ?? targets[0];
    if (target) {
      result.set(choice.id, target);
      usedCounts.set(key, used + 1);
    }
  }

  return result;
};
