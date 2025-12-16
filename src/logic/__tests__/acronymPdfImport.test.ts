import { describe, expect, it } from 'vitest';
import { extractAcronymsFromPdfTextItems } from '../acronymPdfImport';

describe('acronym PDF import', () => {
  it('extracts entries, keeps duplicates, and joins wrapped definitions', () => {
    const items = [
      { str: 'ACRONYM', transform: [0, 0, 0, 0, 54, 600] },
      { str: 'SPELLED OUT', transform: [0, 0, 0, 0, 120, 600] },
      { str: 'CAPTCHA', transform: [0, 0, 0, 0, 54, 500] },
      { str: 'Completely Automated Public Turing', transform: [0, 0, 0, 0, 120, 500] },
      { str: 'Test to Tell Computers and Humans Apart', transform: [0, 0, 0, 0, 120, 490] },
      { str: 'AV', transform: [0, 0, 0, 0, 54, 480] },
      { str: 'Antivirus', transform: [0, 0, 0, 0, 120, 480] },
      { str: 'AV', transform: [0, 0, 0, 0, 54, 470] },
      { str: 'Asset Value', transform: [0, 0, 0, 0, 120, 470] },
      { str: 'CompTIA Security+ Certification Exam Objectives', transform: [0, 0, 0, 0, 54, 40] },
    ];

    const result = extractAcronymsFromPdfTextItems(items, 'security-plus');
    expect(result.entries.map((entry) => entry.acronym)).toEqual(['CAPTCHA', 'AV', 'AV']);
    expect(result.entries[0]?.definition).toBe(
      'Completely Automated Public Turing Test to Tell Computers and Humans Apart',
    );
    expect(result.entries[1]?.id).toBe('acr-security-plus-AV');
    expect(result.entries[2]?.id).toBe('acr-security-plus-AV-2');
    expect(result.skippedLines.some((line) => line.includes('CompTIA Security+'))).toBe(true);
  });

  it('keeps pages separate and extracts multiple table columns', () => {
    const items = [
      { str: 'ACRONYM', transform: [0, 0, 0, 0, 54, 600], pageNumber: 1 },
      { str: 'SPELLED OUT', transform: [0, 0, 0, 0, 120, 600], pageNumber: 1 },
      { str: 'ACRONYM', transform: [0, 0, 0, 0, 318, 600], pageNumber: 1 },
      { str: 'SPELLED OUT', transform: [0, 0, 0, 0, 375, 600], pageNumber: 1 },
      { str: 'CAPTCHA', transform: [0, 0, 0, 0, 54, 580], pageNumber: 1 },
      { str: 'Completely Automated Public Turing', transform: [0, 0, 0, 0, 120, 580], pageNumber: 1 },
      { str: 'AV', transform: [0, 0, 0, 0, 318, 580], pageNumber: 1 },
      { str: 'Antivirus', transform: [0, 0, 0, 0, 375, 580], pageNumber: 1 },
      { str: 'Test to Tell Computers and Humans Apart', transform: [0, 0, 0, 0, 120, 570], pageNumber: 1 },
      { str: 'SLE', transform: [0, 0, 0, 0, 318, 570], pageNumber: 1 },
      { str: 'Single Loss Expectancy', transform: [0, 0, 0, 0, 375, 570], pageNumber: 1 },
      { str: 'MTBF', transform: [0, 0, 0, 0, 54, 580], pageNumber: 2 },
      { str: 'Mean Time Between Failures', transform: [0, 0, 0, 0, 120, 580], pageNumber: 2 },
      { str: 'DNS', transform: [0, 0, 0, 0, 318, 580], pageNumber: 2 },
      { str: 'Domain Name Service', transform: [0, 0, 0, 0, 375, 580], pageNumber: 2 },
    ];

    const result = extractAcronymsFromPdfTextItems(items, 'security-plus');
    expect(result.entries.map((entry) => entry.acronym)).toEqual(['CAPTCHA', 'AV', 'SLE', 'MTBF', 'DNS']);
    expect(result.entries[0]?.definition).toBe(
      'Completely Automated Public Turing Test to Tell Computers and Humans Apart',
    );
  });
});
