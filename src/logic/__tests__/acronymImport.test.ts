import { describe, expect, it } from 'vitest';
import { createAcronymId, parseAcronymText } from '../acronymImport';

describe('acronym import parsing', () => {
  it('creates stable ids', () => {
    expect(createAcronymId('security-plus', 'AAA')).toBe('acr-security-plus-AAA');
    expect(createAcronymId('security-plus', 'S/MIME')).toBe('acr-security-plus-S-MIME');
  });

  it('parses delimiter and space-separated formats', () => {
    const input = `
AAA - Authentication, Authorization, Accounting
ACL: Access Control List
RBAC Role-Based Access Control
`;

    const result = parseAcronymText(input, 'security-plus');
    expect(result.skippedLines).toEqual([]);
    expect(result.entries.map((entry) => entry.acronym)).toEqual(['AAA', 'ACL', 'RBAC']);
    expect(result.entries.find((entry) => entry.acronym === 'ACL')?.definition).toBe('Access Control List');
  });

  it('tracks unparseable lines', () => {
    const input = `
CompTIA Security+ Acronyms
This is not an entry
123
`;

    const result = parseAcronymText(input, 'security-plus');
    expect(result.entries).toHaveLength(0);
    expect(result.skippedLines).toEqual(['This is not an entry']);
  });
});

