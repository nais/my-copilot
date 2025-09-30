import { formatNumber, formatPercentage } from './format';

describe('formatNumber', () => {
  it('should format numbers with Norwegian locale (space as thousands separator)', () => {
    // Norwegian locale uses non-breaking space (U+00A0) as thousands separator
    expect(formatNumber(1000)).toBe('1\u00A0000');
    expect(formatNumber(10000)).toBe('10\u00A0000');
    expect(formatNumber(100000)).toBe('100\u00A0000');
    expect(formatNumber(1000000)).toBe('1\u00A0000\u00A0000');
  });

  it('should handle small numbers', () => {
    expect(formatNumber(0)).toBe('0');
    expect(formatNumber(42)).toBe('42');
    expect(formatNumber(999)).toBe('999');
  });

  it('should handle negative numbers', () => {
    // Norwegian locale uses minus sign (U+2212) and non-breaking space
    expect(formatNumber(-1000)).toBe('\u22121\u00A0000');
    expect(formatNumber(-42)).toBe('\u221242');
  });
});

describe('formatPercentage', () => {
  it('should format percentages correctly', () => {
    expect(formatPercentage(0)).toBe('0%');
    expect(formatPercentage(25)).toBe('25%');
    expect(formatPercentage(100)).toBe('100%');
  });

  it('should handle decimal percentages', () => {
    expect(formatPercentage(25.5)).toBe('25.5%');
    expect(formatPercentage(99.9)).toBe('99.9%');
  });
});
