import { expect, test } from '@playwright/test';
import { SECURITY_PLUS_LESSONS } from '../src/data/securityPlusLessons';

const diagramSlides = SECURITY_PLUS_LESSONS.flatMap((lesson, lessonIndex) =>
  lesson.slides.flatMap((slide, slideIndex) =>
    slide.type === 'diagram'
      ? [
          {
            caption: slide.caption,
            lessonIndex,
            lessonTitle: lesson.title,
            lessonSubtitle: lesson.subtitle,
            slideIndex,
            slideTotal: lesson.slides.length,
          },
        ]
      : [],
  ),
);

test.describe.configure({ mode: 'serial' });

test('all diagram slides render cropped PDF canvases without fallback errors', async ({ page }) => {
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

  for (const diagram of diagramSlides) {
    await page.goto(`/lessons/${diagram.lessonIndex}?slide=${diagram.slideIndex + 1}`);

    await expect(page.getByText(`${diagram.lessonTitle} - ${diagram.lessonSubtitle}`)).toBeVisible();
    await expect(page.getByText(`Slide ${diagram.slideIndex + 1} of ${diagram.slideTotal}`)).toBeVisible();

    const viewport = page.getByTestId('lesson-slide-viewport');
    const canvas = viewport.locator('canvas').first();

    await expect(viewport).toContainText(diagram.caption);
    await expect(viewport.getByText(/Could not render diagram/i)).toHaveCount(0);
    await expect(viewport.getByText(/Rendering page/i)).toHaveCount(0, { timeout: 30000 });
    await expect(viewport.getByText(/cropped from source PDF/i)).toBeVisible();
    await expect(viewport.locator('canvas')).toHaveCount(1);
    await expect(canvas).toBeVisible();
    await expect
      .poll(
        async () =>
          canvas.evaluate((node) => {
            const rect = node.getBoundingClientRect();
            return Math.round(rect.width) > 0 && Math.round(rect.height) > 0;
          }),
        {
          message: `${diagram.caption} should render a visible cropped canvas`,
          timeout: 30000,
        },
      )
      .toBe(true);

    const canvasSize = await canvas.boundingBox();
    expect(canvasSize?.width ?? 0, `${diagram.caption} should render a visible cropped canvas`).toBeGreaterThanOrEqual(150);
    expect(canvasSize?.height ?? 0, `${diagram.caption} should render a visible cropped canvas`).toBeGreaterThanOrEqual(80);
  }

  expect(consoleErrors).toEqual([]);
  expect(pageErrors).toEqual([]);
});
