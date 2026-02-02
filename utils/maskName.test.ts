import { describe, expect, it } from 'vitest';
import maskName from './maskName';

describe('maskName', () => {
  describe('with valid names', () => {
    it('should keep first name visible and mask subsequent names', () => {
      const result = maskName('João Silva');
      expect(result).toBe('João S***a');
    });

    it('should handle single name without masking', () => {
      const result = maskName('João');
      expect(result).toBe('João');
    });

    it('should mask multiple names after the first', () => {
      const result = maskName('Maria das Graças Silva');
      expect(result).toBe('Maria d*s G****s S***a');
    });

    it('should handle two-letter last names', () => {
      const result = maskName('João da');
      expect(result).toBe('João da');
    });

    it('should handle three-letter last names', () => {
      const result = maskName('João dos');
      expect(result).toBe('João d*s');
    });
  });

  describe('with invalid input', () => {
    it('should return empty string for null', () => {
      const result = maskName(null as unknown as string);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = maskName(undefined as unknown as string);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = maskName('');
      expect(result).toBe('');
    });
  });

  describe('edge cases', () => {
    it('should handle names with leading/trailing whitespace', () => {
      const result = maskName('  João Silva  ');
      expect(result).toBe('João S***a');
    });

    it('should handle whitespace-only string', () => {
      const result = maskName('   ');
      expect(result).toBe('');
    });

    it('should handle names with multiple spaces between words', () => {
      const result = maskName('João  Silva');
      expect(result).toBe('João S***a');
    });
  });
});
