import { expect, test } from '@playwright/test';
import { SECURITY_PLUS_LESSONS } from '../src/data/securityPlusLessons';

const BROKEN_CONTENT_PATTERN = /\bundefined\b|\bnull\b|\bNaN\b|\[object Object\]/i;

const normalizeText = (value: string | null): string => value?.replace(/\s+/g, ' ').trim() ?? '';

test.describe.configure({ mode: 'serial' });

test('all lessons render readable slide content without browser errors', async ({ page }) => {
  test.setTimeout(10 * 60 * 1000);

  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('/lessons');

  await expect(page.getByRole('heading', { name: 'Security+ Guided Lessons' })).toBeVisible();
  await expect(page.getByText(`${SECURITY_PLUS_LESSONS.length} structured lessons`)).toBeVisible();

  for (const [lessonIndex, lesson] of SECURITY_PLUS_LESSONS.entries()) {
    await page.goto(`/lessons/${lessonIndex}`);

    await expect(page.getByText(`${lesson.title} - ${lesson.subtitle}`)).toBeVisible();

    const viewport = page.getByTestId('lesson-slide-viewport');

    for (let slideIndex = 0; slideIndex < lesson.slides.length; slideIndex += 1) {
      await expect(page.getByText(`Slide ${slideIndex + 1} of ${lesson.slides.length}`)).toBeVisible();

      const visibleText = normalizeText(await viewport.textContent());

      expect.soft(
        visibleText.length,
        `Lesson ${lessonIndex + 1} slide ${slideIndex + 1} should contain readable text`,
      ).toBeGreaterThan(20);
      expect.soft(
        visibleText,
        `Lesson ${lessonIndex + 1} slide ${slideIndex + 1} should not contain obvious render placeholders`,
      ).not.toMatch(BROKEN_CONTENT_PATTERN);

      if (slideIndex < lesson.slides.length - 1) {
        await page.getByRole('button', { name: /Next/ }).click();
      }
    }

    await page.getByRole('button', { name: 'Finish' }).click();
    await expect(page.getByText(`${lesson.title} Complete`)).toBeVisible();
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
