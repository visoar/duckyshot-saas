import { cn, formatCurrency } from './utils';

describe('cn', () => {
  it('should merge class names correctly', () => {
    expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
  });

  it('should handle conditional class names', () => {
    expect(cn('bg-red-500', { 'text-white': true, 'font-bold': false })).toBe('bg-red-500 text-white');
  });

  it('should override conflicting Tailwind CSS classes', () => {
    expect(cn('p-4', 'p-2')).toBe('p-2');
  });

  it('should handle empty inputs', () => {
    expect(cn()).toBe('');
  });

  it('should handle mixed valid and invalid inputs', () => {
    expect(cn('bg-blue-500', null, 'text-lg', undefined, { 'mx-auto': true })).toBe('bg-blue-500 text-lg mx-auto');
  });
});

describe('formatCurrency', () => {
  it('should format cents to USD currency by default', () => {
    expect(formatCurrency(1299)).toBe('$12.99');
    expect(formatCurrency(0)).toBe('$0.00');
    expect(formatCurrency(100)).toBe('$1.00');
    expect(formatCurrency(50)).toBe('$0.50');
  });

  it('should format cents to specified currency', () => {
    expect(formatCurrency(1299, 'EUR')).toBe('€12.99');
    expect(formatCurrency(1299, 'GBP')).toBe('£12.99');
    expect(formatCurrency(1299, 'JPY')).toBe('¥13'); // JPY doesn't use decimal places
  });

  it('should handle large amounts correctly', () => {
    expect(formatCurrency(123456789)).toBe('$1,234,567.89');
    expect(formatCurrency(999999)).toBe('$9,999.99');
  });

  it('should handle negative amounts', () => {
    expect(formatCurrency(-1299)).toBe('-$12.99');
    expect(formatCurrency(-100)).toBe('-$1.00');
  });

  it('should handle edge cases', () => {
    expect(formatCurrency(1)).toBe('$0.01');
    expect(formatCurrency(99)).toBe('$0.99');
  });
});
