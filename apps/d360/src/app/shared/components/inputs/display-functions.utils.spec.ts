import { SelectableValue } from './autocomplete/selectable-values.utils';
import { DisplayFunctions } from './display-functions.utils';

describe('DisplayFunctions', () => {
  describe('displayFnId', () => {
    it('should return the id when option is a SelectableValue with id', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      expect(DisplayFunctions.displayFnId(option)).toBe('test-id');
    });

    it('should return the string when option is a string', () => {
      const option = 'test-string';
      expect(DisplayFunctions.displayFnId(option)).toBe('test-string');
    });

    it('should return "-" when option is a SelectableValue without id', () => {
      const option: SelectableValue = { text: 'Test Text' } as any;
      expect(DisplayFunctions.displayFnId(option)).toBe('-');
    });

    it('should return "-" when option is neither a string nor a SelectableValue', () => {
      const option = null as any;
      expect(DisplayFunctions.displayFnId(option as any)).toBe('-');
    });
  });

  describe('displayFnText', () => {
    it('should return the text when option is a SelectableValue with text', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      expect(DisplayFunctions.displayFnText(option)).toBe('Test Text');
    });

    it('should return the string when option is a string', () => {
      const option = 'test-string';
      expect(DisplayFunctions.displayFnText(option)).toBe('test-string');
    });

    it('should return "-" when option is a SelectableValue without text', () => {
      const option: SelectableValue = { id: 'test-id' } as any;
      expect(DisplayFunctions.displayFnText(option)).toBe('-');
    });

    it('should return "-" when option is neither a string nor a SelectableValue', () => {
      const option = null as any;
      expect(DisplayFunctions.displayFnText(option as any)).toBe('-');
    });
  });

  describe('displayFnUnited', () => {
    it('should return combined id and text when option is a SelectableValue', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      expect(DisplayFunctions.displayFnUnited(option)).toBe(
        'test-id - Test Text'
      );
    });

    it('should return the string when option is a string', () => {
      const option = 'test-string';
      expect(DisplayFunctions.displayFnUnited(option)).toBe('test-string');
    });

    it('should handle undefined id or text with "undefined" placeholder', () => {
      const optionNoId: SelectableValue = { text: 'Test Text' } as any;
      const optionNoText: SelectableValue = { id: 'test-id' } as any;

      expect(DisplayFunctions.displayFnUnited(optionNoId)).toBe('-');
      expect(DisplayFunctions.displayFnUnited(optionNoText)).toBe('-');
    });

    it('should return "-" when option is neither a string nor a SelectableValue', () => {
      const option = null as any;
      expect(DisplayFunctions.displayFnUnited(option as any)).toBe('-');
    });
  });

  describe('displayFnUnitedNullable', () => {
    it('should return combined id and text when option is a SelectableValue', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      expect(DisplayFunctions.displayFnUnitedNullable(option)).toBe(
        'test-id - Test Text'
      );
    });

    it('should return the string when option is a string', () => {
      const option = 'test-string';
      expect(DisplayFunctions.displayFnUnitedNullable(option)).toBe(
        'test-string'
      );
    });

    it('should handle undefined id or text with "undefined" placeholder', () => {
      const optionNoId: SelectableValue = { text: 'Test Text' } as any;
      const optionNoText: SelectableValue = { id: 'test-id' } as any;

      expect(DisplayFunctions.displayFnUnitedNullable(optionNoId)).toBe('');
      expect(DisplayFunctions.displayFnUnitedNullable(optionNoText)).toBe('');
    });

    it('should return empty string when option is neither a string nor a SelectableValue', () => {
      const option = null as any;
      expect(DisplayFunctions.displayFnUnitedNullable(option as any)).toBe('');
    });
  });
});
