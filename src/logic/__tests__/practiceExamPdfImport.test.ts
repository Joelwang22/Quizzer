import { describe, expect, it } from 'vitest';
import { PracticeExamPdfQuestionParser } from '../practiceExamPdfImport';
import { isMCQ } from '../../models';

describe('practice exam PDF import', () => {
  it('parses chapter answer sections into MCQ questions', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 1-110',
      'Question 1.',
      'A client disputes having signed a digital contract.',
      'Which security concept is the service provider relying on?',
      '(A)',
      'Authentication',
      '(B)',
      'Confidentiality',
      '(C)',
      'Non-repudiation',
      '(D)',
      'Access Control',
      'Explanation 1. Correct Answer: C. Non-repudiation ensures parties cannot deny authenticity.',
      '51',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(1);
    const question = result.questions[0];
    expect(question?.id).toBe('imp-examsdigest-sy0701-chapter-1-0001');
    expect(question?.type).toBe('mcq_single');
    expect(question?.subjectId).toBe('security-plus');
    expect(question?.topicIds).toEqual(['general-security-concepts']);
    expect(isMCQ(question!)).toBe(true);
    if (!question || !isMCQ(question)) {
      throw new Error('Expected MCQ question');
    }
    expect(question.correctChoiceIds).toEqual(['c']);
    expect(question.choices.map((choice) => choice.id)).toEqual(['a', 'b', 'c', 'd']);
    expect(question.choices[2]?.text).toBe('Non-repudiation');
    expect(question.explanation).toContain('Correct Answer: C.');
    expect(result.requiredTopics.some((topic) => topic.id === 'general-security-concepts')).toBe(true);
  });

  it('parses exam simulator sections and handles wrapped correct-answer lines', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 101-200',
      'Question 101.',
      'XYZ Corp is implementing a new vulnerability scanning solution.',
      '(A)',
      'Host-based Intrusion Detection System (HIDS)',
      '(B)',
      'Agentless Vulnerability Scanner',
      '(C)',
      'Client-based Vulnerability Scanner',
      '(D)',
      'Host-based Intrusion Prevention System (HIPS)',
      'Explanation 101.',
      'Correct Answer: B. Agentless',
      'Vulnerability Scanner.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(1);
    const question = result.questions[0];
    expect(question?.id).toBe('imp-examsdigest-sy0701-exam-sim-2-0101');
    expect(question?.topicIds).toEqual(['examsdigest-exam-simulator-2']);
    if (!question || !isMCQ(question)) {
      throw new Error('Expected MCQ question');
    }
    expect(question.correctChoiceIds).toEqual(['b']);
    expect(question.explanation).toContain('Correct Answer: B.');
    expect(question.explanation).toContain('Vulnerability Scanner.');
  });

  it('creates multi-select questions when multiple answers are present', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 1-100',
      'Question 3.',
      'Select all controls that apply.',
      '(A)',
      'Input validation',
      '(B)',
      'Weak passwords',
      '(C)',
      'Parameterized queries',
      '(D)',
      'Disable logging',
      'Explanation 3. Correct Answers: A, C.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(1);
    const question = result.questions[0];
    expect(question?.id).toBe('imp-examsdigest-sy0701-exam-sim-1-0003');
    expect(question?.type).toBe('mcq_multi');
    if (!question || !isMCQ(question)) {
      throw new Error('Expected MCQ question');
    }
    expect(question.correctChoiceIds).toEqual(['a', 'c']);
  });

  it('accepts question headers with missing punctuation', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 311-460',
      'Question 444 OmegaTech’s security team noticed an increase in account compromises.',
      '(A) Encourage monthly changes',
      '(B) Lockout after failed attempts',
      '(C) Prohibit password reuse',
      '(D) Alphabetical-only passwords',
      'Explanation 444 Correct Answer: C.',
      '. Question 456. MetroTech recently experienced an incident where an employee mistakenly deleted data.',
      '(A) Weekly snapshots',
      '(B) Differential backups',
      '(C) Disable backups',
      '(D) Store backups on the same disk',
      'Explanation 456. Correct Answer: B.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(2);
    const [q444, q456] = result.questions;
    expect(q444?.id).toBe('imp-examsdigest-sy0701-chapter-4-0444');
    expect(q456?.id).toBe('imp-examsdigest-sy0701-chapter-4-0456');

    expect(isMCQ(q444!)).toBe(true);
    expect(isMCQ(q456!)).toBe(true);
    if (!q444 || !isMCQ(q444) || !q456 || !isMCQ(q456)) {
      throw new Error('Expected MCQ questions');
    }
    expect(q444.correctChoiceIds).toEqual(['c']);
    expect(q456.correctChoiceIds).toEqual(['b']);
  });

  it('suppresses common source PDF explanation numbering typos', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 101-200',
      'Question 175. Choose the best option.',
      '(A) Option A',
      '(B) Option B',
      '(C) Option C',
      '(D) Option D',
      'Explanation 176. Correct Answer: B.',
      'Question 176. Another question.',
      '(A) One',
      '(B) Two',
      '(C) Three',
      '(D) Four',
      'Explanation 176. Correct Answer: C.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(2);
    expect(result.warnings).toEqual([]);
  });

  it('suppresses explanation numbers that omit leading digits', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 301-400',
      'Question 362. Sample question.',
      '(A) One',
      '(B) Two',
      '(C) Three',
      '(D) Four',
      'Explanation 62. Correct Answer: A.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(1);
    expect(result.warnings).toEqual([]);
  });

  it('suppresses explanation numbers that repeat the previous question number', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 501-600',
      'Question 530. Sample question.',
      '(A) One',
      '(B) Two',
      '(C) Three',
      '(D) Four',
      'Explanation 530. Correct Answer: C.',
      'Question 531. Sample question.',
      '(A) One',
      '(B) Two',
      '(C) Three',
      '(D) Four',
      'Explanation 530. Correct Answer: B.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(2);
    expect(result.warnings).toEqual([]);
  });

  it('deduplicates identical questions across sections and merges topic tags', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus');
    const lines = [
      'Answers 1-110',
      'Question 1.',
      'A client disputes having signed a digital contract.',
      'Which security concept is the service provider relying on?',
      '(A) Authentication',
      '(B) Confidentiality',
      '(C) Non-repudiation',
      '(D) Access Control',
      'Explanation 1. Correct Answer: C. Short explanation.',
      'Answers 501-600',
      'Question 501.',
      'A client disputes having signed a digital contract.',
      'Which security concept is the service provider relying on?',
      '(A) Authentication',
      '(B) Confidentiality',
      '(C) Non-repudiation',
      '(D) Access Control',
      'Explanation 501. Correct Answer: C. Longer explanation that should win when merging duplicates.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(1);
    expect(result.duplicateCount).toBe(1);

    const question = result.questions[0];
    expect(question?.id).toBe('imp-examsdigest-sy0701-chapter-1-0001');
    expect(question?.topicIds).toEqual(['general-security-concepts', 'examsdigest-answers-501-600']);
    expect(question?.explanation).toContain('Longer explanation that should win');
  });

  it('can restrict imports to chapter sections only', () => {
    const parser = new PracticeExamPdfQuestionParser('security-plus', { sectionScope: 'chapters' });
    const lines = [
      'Answers 1-100',
      'Question 1.',
      'Ignored simulator question.',
      '(A) Option A',
      '(B) Option B',
      '(C) Option C',
      '(D) Option D',
      'Explanation 1. Correct Answer: A.',
      'Answers 1-110',
      'Question 1.',
      'A client disputes having signed a digital contract.',
      'Which security concept is the service provider relying on?',
      '(A) Authentication',
      '(B) Confidentiality',
      '(C) Non-repudiation',
      '(D) Access Control',
      'Explanation 1. Correct Answer: C.',
    ];

    lines.forEach((line) => parser.consumeLine(line));
    const result = parser.finalize();

    expect(result.questions).toHaveLength(1);
    expect(result.questions[0]?.id).toBe('imp-examsdigest-sy0701-chapter-1-0001');
    expect(result.questions[0]?.topicIds).toEqual(['general-security-concepts']);
  });
});
