import type { Acronym } from '../models';

export interface AcronymParseResult {
  entries: Acronym[];
  skippedLines: string[];
}

const delimiterPattern = /\s*(?:-|–|—|:)\s*/;
const acronymTokenPattern = /^[A-Za-z0-9][A-Za-z0-9/+.-]{1,24}$/;

const normaliseWhitespace = (value: string): string => value.replace(/\s+/g, ' ').trim();

export const createAcronymId = (subjectId: string, acronym: string): string => {
  const slug = normaliseWhitespace(acronym)
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
  return `acr-${subjectId}-${slug || 'unknown'}`;
};

const looksLikeAcronym = (token: string): boolean => {
  const trimmed = token.trim();
  if (trimmed.length < 2) {
    return false;
  }
  if (!acronymTokenPattern.test(trimmed)) {
    return false;
  }
  if (!/[A-Za-z]/.test(trimmed)) {
    return false;
  }

  const uppercaseCount = (trimmed.match(/[A-Z]/g) ?? []).length;
  if (uppercaseCount === 0) {
    return false;
  }

  const lowercaseCount = (trimmed.match(/[a-z]/g) ?? []).length;
  if (lowercaseCount === 0) {
    return true;
  }

  if (uppercaseCount >= 2) {
    return true;
  }

  const digitCount = (trimmed.match(/[0-9]/g) ?? []).length;
  return digitCount > 0;
};

export const parseAcronymText = (rawText: string, subjectId: string): AcronymParseResult => {
  const lines = rawText
    .split(/\r?\n/)
    .map((line) => normaliseWhitespace(line))
    .filter((line) => line.length > 0);

  const entriesByAcronym = new Map<string, Acronym>();
  const skippedLines: string[] = [];

  let pendingAcronym: string | null = null;

  const upsert = (acronym: string, definition: string): void => {
    const cleanAcronym = normaliseWhitespace(acronym);
    const cleanDefinition = normaliseWhitespace(definition);
    if (!cleanAcronym || !cleanDefinition) {
      return;
    }
    const key = cleanAcronym.toUpperCase();
    entriesByAcronym.set(key, {
      id: createAcronymId(subjectId, cleanAcronym),
      subjectId,
      acronym: cleanAcronym,
      definition: cleanDefinition,
    });
  };

  for (const line of lines) {
    if (/^page\s+\d+/i.test(line) || /^\d+$/.test(line)) {
      continue;
    }
    if (/comptia/i.test(line) && /acronym/i.test(line)) {
      continue;
    }

    const delimiterIndex = line.search(delimiterPattern);
    if (delimiterIndex > 0) {
      const parts = line.split(delimiterPattern);
      const acronym = parts[0] ?? '';
      const definition = parts.slice(1).join(' ').trim();
      if (looksLikeAcronym(acronym) && definition) {
        upsert(acronym, definition);
        pendingAcronym = null;
        continue;
      }
    }

    const firstSpaceIndex = line.indexOf(' ');
    if (firstSpaceIndex > 0) {
      const token = line.slice(0, firstSpaceIndex);
      const rest = line.slice(firstSpaceIndex + 1).trim();
      if (looksLikeAcronym(token) && rest.length > 0) {
        upsert(token, rest);
        pendingAcronym = null;
        continue;
      }
    }

    if (pendingAcronym) {
      const existing = entriesByAcronym.get(pendingAcronym.toUpperCase());
      if (existing) {
        existing.definition = normaliseWhitespace(`${existing.definition} ${line}`);
        entriesByAcronym.set(pendingAcronym.toUpperCase(), existing);
        continue;
      }
      pendingAcronym = null;
    }

    if (looksLikeAcronym(line)) {
      pendingAcronym = line;
      continue;
    }

    skippedLines.push(line);
  }

  return {
    entries: Array.from(entriesByAcronym.values()).sort((a, b) => a.acronym.localeCompare(b.acronym)),
    skippedLines,
  };
};
