import { describe, expect, it } from 'vitest';
import formatCPF from './formatCPF';

describe('formatCPF', () => {
  describe('with valid CPF', () => {
    it('should format a valid 11-digit CPF', () => {
      const result = formatCPF('12345678901');
      expect(result).toBe('123.456.789-01');
    });

    it('should format another valid CPF', () => {
      const result = formatCPF('98765432100');
      expect(result).toBe('987.654.321-00');
    });
  });

  describe('with invalid input', () => {
    it('should return empty string for null', () => {
      const result = formatCPF(null);
      expect(result).toBe('');
    });

    it('should return empty string for undefined', () => {
      const result = formatCPF(undefined);
      expect(result).toBe('');
    });

    it('should return empty string for empty string', () => {
      const result = formatCPF('');
      expect(result).toBe('');
    });

    it('should return trimmed value for CPF with wrong length', () => {
      const result = formatCPF('1234567890');
      expect(result).toBe('1234567890');
    });

    it('should return trimmed value for CPF with letters', () => {
      const result = formatCPF('1234567890A');
      expect(result).toBe('1234567890A');
    });

    it('should return trimmed value for already formatted CPF', () => {
      const result = formatCPF('123.456.789-01');
      expect(result).toBe('123.456.789-01');
    });
  });

  describe('edge cases', () => {
    it('should handle CPF with leading/trailing whitespace', () => {
      const result = formatCPF('  12345678901  ');
      expect(result).toBe('123.456.789-01');
    });

    it('should handle whitespace-only string', () => {
      const result = formatCPF('   ');
      expect(result).toBe('');
    });
  });
});
