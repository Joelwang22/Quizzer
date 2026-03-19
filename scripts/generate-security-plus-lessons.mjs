import fs from 'node:fs/promises';
import path from 'node:path';

const inputPath = path.resolve('docs/extracted/Professor-Messer-SY0-701-COMPTIA.clean.txt');
const outputPath = path.resolve('src/data/securityPlusLessons.generated.ts');

// Allow optional space after the dash to catch "2.4 -An Overview of Malware" style headings
const headingPattern = /^\d\.[1-9]\s-\s?.+$/;
const footerPatterns = [
  /^--- PAGE \d+ ---$/,
  /^\d+$/,
  /^© 2023 Messer Studios/,
  /^https?:\/\//,
  /^ProfessorMesser\.com$/i,
  /ProfessorMesser\.com/i,
  /^Professor Messer/,
  /^Continue your journey on$/i,
  /^SY0-701 CompTIA Security\+ Training Course$/i,
  /^Free Monthly Security\+ Study Group Live Streams$/i,
  /^24 x 7 Live Chat$/i,
  /^Voucher Discounts$/i,
  /Security\+ Success Bundle/i,
  /^Contents$/,
  /^Introduction$/,
  /^The CompTIA Security\+ certification$/,
  /^How to use this book$/,
  /^Section \d\.0 - /,
];

const stripContinuation = (value) => value.replace(/ \(continued\)$/, '').trim();

// Normalize the heading: "2.4 -An Overview" → "2.4 - An Overview"
const normalizeHeading = (value) => value.replace(/^(\d\.\d)\s-\s?/, '$1 - ').trim();

const stripObjectivePrefix = (value) => value.replace(/^\d\.\d\s-\s/, '').trim();

const normalizeWhitespace = (value) =>
  value
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const isFooterLine = (value) => footerPatterns.some((pattern) => pattern.test(value));

const iconFromTitle = (title) => {
  const letters = stripObjectivePrefix(title)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');

  return letters.slice(0, 2) || 'LS';
};

const truncate = (value, maxLength) => {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 3).trim()}...`;
};

const escapeHtml = (value) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

const chunk = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

const cleanupSectionLines = (lines) =>
  lines
    .map((line) => normalizeWhitespace(line))
    .filter(Boolean)
    .filter((line) => !isFooterLine(line));

const parseSections = (text) => {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let currentSection = null;
  let inContent = false;
  let currentPage = 0;

  for (const [index, rawLine] of lines.entries()) {
    const line = normalizeWhitespace(rawLine);

    const pageMatch = /^--- PAGE (\d+) ---$/.exec(line);
    if (pageMatch) {
      currentPage = Number(pageMatch[1]);
    }

    if (!inContent && line === '1.1 - Security Controls' && currentPage >= 10 && index > 150) {
      inContent = true;
    }

    if (!inContent || !line || isFooterLine(line)) {
      continue;
    }

    if (headingPattern.test(line)) {
      const heading = normalizeHeading(stripContinuation(line));
      if (!sections.some((s) => s.heading === heading)) {
        currentSection = { heading, lines: [] };
        sections.push(currentSection);
      } else {
        currentSection = sections.find((s) => s.heading === heading) ?? currentSection;
      }
      continue;
    }

    currentSection?.lines.push(line);
  }

  return sections.map((s) => ({ ...s, lines: cleanupSectionLines(s.lines) }));
};

/**
 * Parse section lines into a structured form.
 * Returns:
 *   - groups: [{heading: string|null, bullets: [{parent, children}]}]
 *   - topParagraphs: standalone paragraph lines not under any bullet
 *
 * A "group" is a sub-heading (no bullet prefix) followed by its bullet items.
 */
const parseSectionBody = (lines) => {
  const groups = []; // [{heading: string|null, bullets: [{parent, children}]}]
  const topParagraphs = []; // non-bullet lines that appear before any sub-heading

  let currentGroup = { heading: null, bullets: [] };
  let currentBullet = null;

  const flushBullet = () => {
    if (!currentBullet) return;
    currentGroup.bullets.push({ ...currentBullet });
    currentBullet = null;
  };

  const flushGroup = () => {
    if (currentGroup.heading !== null || currentGroup.bullets.length > 0) {
      groups.push({ ...currentGroup });
    }
    currentGroup = { heading: null, bullets: [] };
  };

  for (const line of lines) {
    if (line.startsWith('• ')) {
      flushBullet();
      currentBullet = { parent: line.slice(2).trim(), children: [] };
      continue;
    }

    if (line.startsWith('– ') || line.startsWith('- ')) {
      const detail = line.replace(/^[–-]\s/, '').trim();
      if (currentBullet) {
        currentBullet.children.push(detail);
      } else {
        // orphan sub-bullet: attach to last bullet of current group or treat as paragraph
        const lastBullet = currentGroup.bullets[currentGroup.bullets.length - 1];
        if (lastBullet) {
          lastBullet.children.push(detail);
        } else {
          topParagraphs.push(detail);
        }
      }
      continue;
    }

    // No bullet prefix: this is a sub-heading or continuation
    if (currentBullet) {
      // If the line looks like a standalone heading (short, no lower-case start), start new group
      // Otherwise treat as continuation of the current bullet
      const looksLikeHeading = line.length < 60 && /^[A-Z]/.test(line) && !line.includes(',');
      if (looksLikeHeading && currentBullet.children.length > 0) {
        flushBullet();
        flushGroup();
        currentGroup = { heading: line, bullets: [] };
      } else {
        currentBullet.children.push(line);
      }
      continue;
    }

    // No active bullet - this is a sub-heading
    flushBullet();
    if (currentGroup.bullets.length > 0 || currentGroup.heading !== null) {
      flushGroup();
      currentGroup = { heading: line, bullets: [] };
    } else if (currentGroup.heading === null) {
      currentGroup.heading = line;
    } else {
      // Already has a heading, just add another
      currentGroup.heading = `${currentGroup.heading} - ${line}`;
    }
  }

  flushBullet();
  flushGroup();

  return { groups, topParagraphs };
};

/**
 * Format a bullet item as HTML.
 * If the bullet has children, renders as <strong>parent</strong> with a sub-list.
 * If no children, renders as plain (escaped) text.
 */
const formatBulletHtml = (bullet) => {
  const { parent, children } = bullet;
  if (children.length === 0) {
    return escapeHtml(parent);
  }
  const childItems = children
    .map((c) => `<li>${escapeHtml(c)}</li>`)
    .join('');
  return `<strong>${escapeHtml(parent)}</strong><ul class="sub-list">${childItems}</ul>`;
};

/**
 * Format a group as an HTML block for a concept slide.
 */
const formatGroupHtml = (group) => {
  const parts = [];
  if (group.heading) {
    parts.push(`<h4>${escapeHtml(group.heading)}</h4>`);
  }
  if (group.bullets.length > 0) {
    const items = group.bullets.map((b) => `<li>${formatBulletHtml(b)}</li>`).join('');
    parts.push(`<ul>${items}</ul>`);
  }
  return parts.join('');
};

/**
 * Extract plain-text bullet items for the bullets slide type.
 * Each item is a parent bullet with its children summarized.
 */
const flattenToBulletItems = (groups) => {
  const items = [];
  for (const group of groups) {
    for (const bullet of group.bullets) {
      if (bullet.children.length === 0) {
        items.push(escapeHtml(bullet.parent));
      } else {
        const childSummary = bullet.children.slice(0, 3).join('; ');
        const suffix = bullet.children.length > 3 ? '; …' : '';
        items.push(`<strong>${escapeHtml(bullet.parent)}</strong> — ${escapeHtml(childSummary)}${suffix}`);
      }
    }
  }
  return items;
};

/**
 * Build summary points: use parent bullet text (no children noise) for readability.
 */
const makeSummaryPoints = (groups, topParagraphs, heading) => {
  const allParents = groups.flatMap((g) => g.bullets.map((b) => b.parent));
  const raw = [...topParagraphs, ...allParents]
    .map((s) => s.trim())
    .filter((s) => s.length > 20)
    .slice(0, 5)
    .map((s) => truncate(s, 140));

  if (raw.length > 0) return raw;

  return [
    `Review the main ideas behind ${stripObjectivePrefix(heading)}.`,
    'Focus on how this topic supports the broader Security+ workflow.',
  ];
};

/**
 * Build a specific intro question based on section content.
 */
const makeIntroQuestion = (heading, groups) => {
  const topic = stripObjectivePrefix(heading).toLowerCase();
  const firstBullet = groups[0]?.bullets[0]?.parent ?? '';

  // Try to make a more specific question using the first key point
  if (firstBullet.length > 15 && firstBullet.length < 80) {
    const short = firstBullet.replace(/\s+/g, ' ').toLowerCase();
    if (short.includes('prevent') || short.includes('protect') || short.includes('control')) {
      return `How does ${topic} help protect organizational assets?`;
    }
    if (short.includes('attack') || short.includes('exploit') || short.includes('threat')) {
      return `What makes ${topic} a significant security threat?`;
    }
  }
  return `What are the key concepts behind ${topic} for the Security+ exam?`;
};

const createLesson = (section, index, sections) => {
  const { groups, topParagraphs } = parseSectionBody(section.lines);
  const sectionName = stripObjectivePrefix(section.heading);
  const nextHeading = sections[index + 1]?.heading;

  // Intro body: use first meaningful paragraph or first group's heading+first bullet
  const introBody = (() => {
    if (topParagraphs.length > 0 && topParagraphs[0].length > 40) {
      return topParagraphs[0];
    }
    const firstGroup = groups[0];
    if (firstGroup) {
      const heading = firstGroup.heading ?? sectionName;
      const firstBulletText = firstGroup.bullets[0]
        ? `${firstGroup.bullets[0].parent}${firstGroup.bullets[0].children[0] ? ': ' + firstGroup.bullets[0].children[0] : ''}`
        : '';
      return truncate(`${heading}. ${firstBulletText}`, 420).trim();
    }
    return `This lesson covers ${sectionName} as outlined in the CompTIA SY0-701 Security+ objectives.`;
  })();

  // Concept slides: one per group (group = sub-heading + its bullets)
  // Limit to 6 groups max to keep lessons from being excessively long
  const conceptSlides = groups
    .filter((g) => g.heading !== null || g.bullets.length > 0)
    .slice(0, 6)
    .map((g, i) => ({
      type: 'concept',
      title: g.heading ? `${escapeHtml(g.heading)}` : `${sectionName} — Part ${i + 1}`,
      body: formatGroupHtml(g),
    }));

  // Bullets slide: flat list of all parent bullet items across all groups
  // Group into slides of 6 each, up to 3 slides
  const allBulletItems = flattenToBulletItems(groups);
  const bulletSlides = chunk(allBulletItems, 6)
    .slice(0, 3)
    .map((items, i) => ({
      type: 'bullets',
      title: i === 0 ? `${sectionName} — Key Points` : `${sectionName} — Key Points (${i + 1})`,
      items,
    }));

  // Summary
  const summarySlide = {
    type: 'summary',
    title: `${sectionName} — Summary`,
    points: makeSummaryPoints(groups, topParagraphs, section.heading),
    cta: nextHeading
      ? `Continue to ${nextHeading} to keep moving through the Professor Messer Security+ notes in course order.`
      : 'You have reached the end of the Professor Messer Security+ lesson path.',
  };

  const slides = [
    {
      type: 'intro',
      week: section.heading,
      question: makeIntroQuestion(section.heading, groups),
      body: introBody,
    },
    ...conceptSlides,
    ...bulletSlides,
    summarySlide,
  ];

  return {
    id: section.heading
      .toLowerCase()
      .replace(/[^\w]+/g, '-')
      .replace(/^-+|-+$/g, ''),
    title: `Lesson ${index + 1}`,
    subtitle: section.heading,
    icon: iconFromTitle(section.heading),
    slides,
  };
};

const createFileContents = (lessons) =>
  `import type { Lesson } from './securityPlusLessons';

export const GENERATED_SECURITY_PLUS_LESSONS: Lesson[] = ${JSON.stringify(lessons, null, 2)};\n`;

const run = async () => {
  const text = await fs.readFile(inputPath, 'utf8');
  const sections = parseSections(text);
  const lessons = sections.map((section, index) => createLesson(section, index, sections));
  await fs.writeFile(outputPath, createFileContents(lessons), 'utf8');
  console.log(`Generated ${lessons.length} lessons at ${outputPath}`);

  // Print lesson IDs for verification
  for (const lesson of lessons) {
    const slideCount = lesson.slides.length;
    console.log(`  ${lesson.id} (${slideCount} slides)`);
  }
};

run().catch((error) => {
  console.error(error);
  process.exit(1);
});
