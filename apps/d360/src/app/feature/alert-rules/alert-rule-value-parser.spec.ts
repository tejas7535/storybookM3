import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { parseSelectableValueIfPossible } from './alert-rule-value-parser';

describe('parseSelectableValueIfPossible', () => {
  const options: SelectableValue[] = [
    { id: '1', text: 'Option 1' },
    { id: '2', text: 'Option 2' },
    { id: '3', text: 'Option 3' },
    { id: '4', text: 'Option\u00A04' },
  ];

  it('should return the id if newValue matches an option id', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = '1';
    const result = parser(value);
    expect(result).toBe('1');
  });

  it('should return the id if newValue matches an option text', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = 'Option 2';
    const result = parser(value);
    expect(result).toBe('2');
  });

  it('should return newValue if it does not match any option id or text', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = 'Non-existent';
    const result = parser(value);
    expect(result).toBe('Non-existent');
  });

  it('should return newValue if newValue is an empty string', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = '';
    const result = parser(value);
    expect(result).toBe('');
  });

  it('should return newValue if newValue has a protected empty space string', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = 'Option\u00A02';
    const result = parser(value);
    expect(result).toBe('2');
  });

  it('should return clean newValue if an option has a protected empty space string', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = 'Option 4';
    const result = parser(value);
    expect(result).toBe('4');
  });

  it('should return clean newValue if newValue and an option have a protected empty space string', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = 'Option\u00A04';
    const result = parser(value);
    expect(result).toBe('4');
  });

  it('should handle undefined newValue gracefully', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = undefined as any;
    const result = parser(value);
    expect(result).toBeUndefined();
  });

  it('should handle null newValue gracefully', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = null as any;
    const result = parser(value);
    expect(result).toBeNull();
  });

  it('should return newValue if options array is empty', () => {
    const parser = parseSelectableValueIfPossible([]);
    const value = 'Option 1';
    const result = parser(value);
    expect(result).toBe('Option 1');
  });

  it('should return the id of the first matching option if options have duplicate text values', () => {
    const duplicateOptions = [
      { id: '1', text: 'Option 1' },
      { id: '2', text: 'Option 1' },
    ];
    const parser = parseSelectableValueIfPossible(duplicateOptions);
    const value = 'Option 1';
    const result = parser(value);
    expect(result).toBe('1'); // First match
  });

  it('should return the id if newValue matches an option text with leading or trailing spaces', () => {
    const parser = parseSelectableValueIfPossible(options);
    const value = ' Option 2 ';
    const result = parser(value);
    expect(result).toBe('2');
  });
});
