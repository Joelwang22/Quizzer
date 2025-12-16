const GUESSABLE_CHAR_PATTERN = /^[A-Z0-9]$/;

export const DEFAULT_MAX_MISTAKES = 6;

export const normaliseSolution = (raw: string): string => raw.trim().toUpperCase();

export const normaliseGuess = (raw: string): string | null => {
  const candidate = raw.trim().toUpperCase();
  if (candidate.length !== 1) {
    return null;
  }
  return GUESSABLE_CHAR_PATTERN.test(candidate) ? candidate : null;
};

export const maskSolution = (solution: string, correctGuesses: ReadonlySet<string>): string => {
  const normalised = normaliseSolution(solution);
  const masked = Array.from(normalised, (char) => {
    if (!GUESSABLE_CHAR_PATTERN.test(char)) {
      return char;
    }
    return correctGuesses.has(char) ? char : '_';
  });
  return masked.join(' ');
};

export const isSolved = (solution: string, correctGuesses: ReadonlySet<string>): boolean => {
  const normalised = normaliseSolution(solution);
  for (const char of normalised) {
    if (!GUESSABLE_CHAR_PATTERN.test(char)) {
      continue;
    }
    if (!correctGuesses.has(char)) {
      return false;
    }
  }
  return true;
};

