import { describe, expect, it } from 'vitest';
import { isSolved, maskSolution, normaliseGuess } from '../hangman';

describe('hangman helpers', () => {
  it('normalises guesses to single A-Z/0-9 chars', () => {
    expect(normaliseGuess('a')).toBe('A');
    expect(normaliseGuess(' 5 ')).toBe('5');
    expect(normaliseGuess('ab')).toBeNull();
    expect(normaliseGuess('-')).toBeNull();
  });

  it('masks unguessed characters and preserves punctuation', () => {
    const guesses = new Set<string>(['A']);
    expect(maskSolution('AAA', guesses)).toBe('A A A');
    expect(maskSolution('MITM', guesses)).toBe('_ _ _ _');
    expect(maskSolution('S/MIME', new Set<string>(['S', 'M']))).toBe('S / M _ M _');
  });

  it('detects solved solutions', () => {
    expect(isSolved('CIA', new Set<string>(['C', 'I', 'A']))).toBe(true);
    expect(isSolved('CIA', new Set<string>(['C', 'I']))).toBe(false);
    expect(isSolved('S/MIME', new Set<string>(['S', 'M', 'I', 'E']))).toBe(true);
  });
});

