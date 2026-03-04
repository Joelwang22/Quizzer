import { describe, expect, it } from 'vitest';
import { formatExplanationWithOptionLineBreaks } from '../formatExplanation';

describe('formatExplanationWithOptionLineBreaks', () => {
  it('adds line breaks before option tokens when multiple are present', () => {
    const input =
      'Correct Answer: C. Explanation: A. First option. B. Second option. C. Third option. D. Fourth option.';

    const formatted = formatExplanationWithOptionLineBreaks(input, 4);

    expect(formatted).toBe(
      'Correct Answer: C. Explanation:\nA. First option.\nB. Second option.\nC. Third option.\nD. Fourth option.',
    );
  });

  it('does not split the correct answer token when it is the only option reference', () => {
    const input =
      'Correct Answer: C. Non-repudiation ensures parties cannot deny authenticity of a contract they signed.';

    expect(formatExplanationWithOptionLineBreaks(input, 4)).toBe(input);
  });

  it('supports parenthesized option tokens', () => {
    const input = 'Explanation: (A) First. (B) Second.';
    const formatted = formatExplanationWithOptionLineBreaks(input, 4);
    expect(formatted).toBe('Explanation:\n(A) First.\n(B) Second.');
  });

  it('adds line breaks before "Option X" sentences', () => {
    const input =
      'Correct Answer: B. Regular security awareness training. Option A is incorrect. Firewall. Option C is incorrect. IDS. Option D is incorrect. Encryption.';

    const formatted = formatExplanationWithOptionLineBreaks(input, 4);

    expect(formatted).toBe(
      'Correct Answer: B. Regular security awareness training.\nOption A is incorrect. Firewall.\nOption C is incorrect. IDS.\nOption D is incorrect. Encryption.',
    );
  });

  it('avoids false positives when only one option-like token appears', () => {
    const input = 'Class A. networks are large.';
    expect(formatExplanationWithOptionLineBreaks(input, 4)).toBe(input);
  });
});
