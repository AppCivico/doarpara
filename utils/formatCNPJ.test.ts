import { describe, expect, it } from 'vitest';
import formatCNPJ from './formatCNPJ';

describe('formatCNPJ', () => {
  describe('with valid CNPJ', () => {
    it('should format a valid 14-digit CNPJ', () => {
      const result = formatCNPJ('08746641000100');
      expect(result).toBe('08.746.641/0001-00');
    });

    it('should format another valid CNPJ', () => {
      const result = formatCNPJ('12345678000195');
      expect(result).toBe('12.345.678/0001-95');
    });
  });

  describe('with invalid input', () => {
    it('should return empty string for null', () => {
      const result = formatCNPJ(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = formatCNPJ(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatCNPJ('');
      expect(result).toBe('');
    });

    it('should return trimmed value for CNPJ with wrong length', () => {
      const result = formatCNPJ('1234567890');
      expect(result).toBe('1234567890');
    });

    it('should return trimmed value for CNPJ with letters', () => {
      const result = formatCNPJ('0874664100010A');
      expect(result).toBe('0874664100010A');
    });

    it('should return trimmed value for already formatted CNPJ', () => {
      const result = formatCNPJ('08.746.641/0001-00');
      expect(result).toBe('08.746.641/0001-00');
    });
  });

  describe('edge cases', () => {
    it('should handle CNPJ with leading/trailing whitespace', () => {
      const result = formatCNPJ('  08746641000100  ');
      expect(result).toBe('08.746.641/0001-00');
    });

    it('should handle whitespace-only string', () => {
      const result = formatCNPJ('   ');
      expect(result).toBe('');
    });
  });
});
