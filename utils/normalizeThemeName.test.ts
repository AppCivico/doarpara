import { describe, expect, it } from 'vitest';
import normalizeThemeName from './normalizeThemeName.ts';

describe('normalizeThemeName', () => {
  describe('bare names', () => {
    it('prepends theme__ to a bare name', () => {
      expect(normalizeThemeName('default')).toBe('theme__default');
    });

    it('uses theme__default when called with no argument', () => {
      expect(normalizeThemeName()).toBe('theme__default');
    });

    it('handles names with a modifier', () => {
      expect(normalizeThemeName('default--clean')).toBe('theme__default--clean');
    });
  });

  describe('new theme__ prefix', () => {
    it('returns the value unchanged', () => {
      expect(normalizeThemeName('theme__default')).toBe('theme__default');
    });

    it('returns the value unchanged when a modifier is present', () => {
      expect(normalizeThemeName('theme__default--clean')).toBe('theme__default--clean');
    });
  });

  describe('legacy theme-- prefix (retrocompat)', () => {
    it('migrates theme--default to theme__default', () => {
      expect(normalizeThemeName('theme--default')).toBe('theme__default');
    });

    it('migrates theme--custom to theme__custom', () => {
      expect(normalizeThemeName('theme--custom')).toBe('theme__custom');
    });
  });

  describe('edge cases', () => {
    it('trims surrounding whitespace', () => {
      expect(normalizeThemeName('  default  ')).toBe('theme__default');
    });

    it('trims whitespace from a legacy prefixed value', () => {
      expect(normalizeThemeName('  theme--default  ')).toBe('theme__default');
    });
  });
});
