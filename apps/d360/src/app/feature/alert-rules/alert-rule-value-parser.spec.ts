import { SelectableValue } from '../../shared/components/inputs/autocomplete/selectable-values.utils';
import { valueParserForSelectableOptions } from './alert-rule-value-parser';

describe('valueParserForSelectableOptions', () => {
  const options: SelectableValue[] = [
    { id: '1', text: 'Option 1' },
    { id: '2', text: 'Option 2' },
    { id: '3', text: 'Option 3' },
  ];

  it('should return the id if newValue matches an option id', () => {
    const parser = valueParserForSelectableOptions(options);
    const params = { newValue: '1' };
    const result = parser(params);
    expect(result).toBe('1');
  });

  it('should return the id if newValue matches an option text', () => {
    const parser = valueParserForSelectableOptions(options);
    const params = { newValue: 'Option 2' };
    const result = parser(params);
    expect(result).toBe('2');
  });

  it('should return newValue if it does not match any option id or text', () => {
    const parser = valueParserForSelectableOptions(options);
    const params = { newValue: 'Non-existent' };
    const result = parser(params);
    expect(result).toBe('Non-existent');
  });

  it('should return newValue if newValue is an empty string', () => {
    const parser = valueParserForSelectableOptions(options);
    const params = { newValue: '' };
    const result = parser(params);
    expect(result).toBe('');
  });

  it('should handle undefined newValue gracefully', () => {
    const parser = valueParserForSelectableOptions(options);
    const params = { newValue: undefined } as any;
    const result = parser(params);
    expect(result).toBeUndefined();
  });

  it('should handle null newValue gracefully', () => {
    const parser = valueParserForSelectableOptions(options);
    const params = { newValue: null } as any;
    const result = parser(params);
    expect(result).toBeNull();
  });
});
