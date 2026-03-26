import { beforeEach, describe, expect, it } from 'vitest';
import {
  SECURITY_PLUS_LESSONS,
  getDiagramStorageKey,
  getDoneLessons,
  markLessonDone,
  searchLessons,
} from '../securityPlusLessons';
import {
  getLessonDiagramCrop,
  LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY,
} from '../lessonDiagramCrops';

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
    expect(SECURITY_PLUS_LESSONS.length).toBeGreaterThanOrEqual(110);
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

  it('includes the gap-remediation supplement topics in search results', () => {
    expect(searchLessons('LDAP injection').length).toBeGreaterThan(0);
    expect(searchLessons('distinguished name').length).toBeGreaterThan(0);
    expect(searchLessons('STARTTLS').length).toBeGreaterThan(0);
    expect(searchLessons('data historian').length).toBeGreaterThan(0);
    expect(searchLessons('mobile threat defense').length).toBeGreaterThan(0);
    expect(searchLessons('background checks').length).toBeGreaterThan(0);
    expect(searchLessons('Purdue Model').length).toBeGreaterThan(0);
    expect(searchLessons('split tunneling').length).toBeGreaterThan(0);
    expect(searchLessons('agentless NAC').length).toBeGreaterThan(0);
    expect(searchLessons('SOAR').length).toBeGreaterThan(0);
    expect(searchLessons('SFTP').length).toBeGreaterThan(0);
    expect(searchLessons('FTPS').length).toBeGreaterThan(0);
    expect(searchLessons('port 587').length).toBeGreaterThan(0);
    expect(searchLessons('TACACS+').length).toBeGreaterThan(0);
    expect(searchLessons('SNMPv3').length).toBeGreaterThan(0);
    expect(searchLessons('BPDU Guard').length).toBeGreaterThan(0);
    expect(searchLessons('clock skew').length).toBeGreaterThan(0);
    expect(searchLessons('syslog severity').length).toBeGreaterThan(0);
    expect(searchLessons('Self-Encrypting Drive').length).toBeGreaterThan(0);
    expect(searchLessons('Device Provisioning Protocol').length).toBeGreaterThan(0);
    expect(searchLessons('juice jacking').length).toBeGreaterThan(0);
    expect(searchLessons('gamification').length).toBeGreaterThan(0);
    expect(searchLessons('CMDB').length).toBeGreaterThan(0);
  });

  it('covers every lesson diagram with a source-PDF crop box', () => {
    const diagramSlides = SECURITY_PLUS_LESSONS.flatMap((lesson) =>
      lesson.slides.filter((slide) => slide.type === 'diagram'),
    );

    expect(diagramSlides.length).toBeGreaterThan(20);
    expect(diagramSlides.every((slide) => getLessonDiagramCrop(slide))).toBe(true);
  });

  it('assigns a unique stable diagram id to every diagram slide', () => {
    const diagramIds = SECURITY_PLUS_LESSONS.flatMap((lesson) =>
      lesson.slides.flatMap((slide) =>
        slide.type === 'diagram' ? [getDiagramStorageKey(lesson.id, slide)] : [],
      ),
    );

    expect(diagramIds.length).toBeGreaterThan(20);
    expect(new Set(diagramIds).size).toBe(diagramIds.length);
  });

  it('migrates legacy diagram override keys to stable diagram ids', () => {
    const locatedDiagram = SECURITY_PLUS_LESSONS.flatMap((lesson) =>
      lesson.slides.map((slide, slideIndex) => ({ lesson, slide, slideIndex })),
    ).find(({ slide }) => slide.type === 'diagram');

    if (!locatedDiagram || locatedDiagram.slide.type !== 'diagram') {
      throw new Error('Expected at least one lesson containing a diagram slide');
    }

    const { lesson, slide, slideIndex } = locatedDiagram;

    const legacyKey = `${lesson.id}::${slideIndex}`;
    const stableKey = getDiagramStorageKey(lesson.id, slide);
    const override = { x: 0.11, y: 0.22, width: 0.33, height: 0.44 };

    localStorage.setItem(
      LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY,
      JSON.stringify({ [legacyKey]: override }),
    );

    expect(getLessonDiagramCrop(slide, stableKey)).toEqual(override);
    expect(JSON.parse(localStorage.getItem(LESSON_DIAGRAM_DEBUG_OVERRIDE_STORAGE_KEY) ?? '{}')).toEqual({
      [stableKey]: override,
    });
  });
});
