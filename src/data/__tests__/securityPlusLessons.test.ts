import { beforeEach, describe, expect, it } from 'vitest';
import {
  SECURITY_PLUS_LESSONS,
  getDoneLessons,
  markLessonDone,
  searchLessons,
} from '../securityPlusLessons';

describe('securityPlusLessons', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('searches lesson content by keyword', () => {
    const results = searchLessons('zero trust');

    expect(results.length).toBeGreaterThan(0);
    expect(results.some((result) => result.lessonId === '1-2-zero-trust')).toBe(true);
  });

  it('stores completed lessons without duplicates', () => {
    markLessonDone('1-1-security-controls');
    markLessonDone('1-1-security-controls');

    expect(getDoneLessons()).toEqual(['1-1-security-controls']);
  });

  it('covers the full Messer course plus supplemental missing topics', () => {
    expect(SECURITY_PLUS_LESSONS).toHaveLength(120);
    expect(SECURITY_PLUS_LESSONS.every((lesson) => lesson.slides.length >= 5)).toBe(true);
  });

  it('covers the Messer section path through 5.6 and includes supplemental 4.9 coverage', () => {
    const subtitles = SECURITY_PLUS_LESSONS.map((lesson) => lesson.subtitle).join(' ');

    const coveredObjectives = new Set(subtitles.match(/\d\.\d/g) ?? []);

    expect(Array.from(coveredObjectives)).toEqual(
      expect.arrayContaining([
        '1.1',
        '1.2',
        '1.3',
        '1.4',
        '2.1',
        '2.2',
        '2.3',
        '2.4',
        '2.5',
        '3.1',
        '3.2',
        '3.3',
        '3.4',
        '4.1',
        '4.2',
        '4.3',
        '4.4',
        '4.5',
        '4.6',
        '4.7',
        '4.8',
        '4.9',
        '5.1',
        '5.2',
        '5.3',
        '5.4',
        '5.5',
        '5.6',
      ]),
    );
  });

  it('includes representative late-course topics in search results', () => {
    expect(searchLessons('802.1X').length).toBeGreaterThan(0);
    expect(searchLessons('password vaulting').length).toBeGreaterThan(0);
    expect(searchLessons('security awareness').length).toBeGreaterThan(0);
    expect(searchLessons('packet captures').length).toBeGreaterThan(0);
  });
});
