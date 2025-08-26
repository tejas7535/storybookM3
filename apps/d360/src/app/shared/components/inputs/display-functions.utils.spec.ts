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

  describe('displayFnTooltip', () => {
    it('should return text when id equals the display name from getOptionName', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      const getOptionName = () => 'test-id';
      expect(DisplayFunctions.displayFnTooltip(option, getOptionName)).toBe(
        'Test Text'
      );
    });

    it('should return id when id does not equal the display name from getOptionName', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      const getOptionName = () => 'Test Text';
      expect(DisplayFunctions.displayFnTooltip(option, getOptionName)).toBe(
        'test-id'
      );
    });

    it('should return text when using displayFnText and id equals text', () => {
      const option: SelectableValue = { id: 'same-value', text: 'same-value' };
      expect(
        DisplayFunctions.displayFnTooltip(
          option,
          DisplayFunctions.displayFnText
        )
      ).toBe('same-value');
    });

    it('should return id when using displayFnText and id does not equal text', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      expect(
        DisplayFunctions.displayFnTooltip(
          option,
          DisplayFunctions.displayFnText
        )
      ).toBe('test-id');
    });

    it('should return id when using displayFnId', () => {
      const option: SelectableValue = { id: 'test-id', text: 'Test Text' };
      expect(
        DisplayFunctions.displayFnTooltip(option, DisplayFunctions.displayFnId)
      ).toBe('Test Text');
    });

    it('should return the string when option is a string', () => {
      const option = 'test-string';
      const getOptionName = () => 'anything';
      expect(DisplayFunctions.displayFnTooltip(option, getOptionName)).toBe(
        'test-string'
      );
    });

    it('should return "-" when option is not a SelectableValue or string', () => {
      const option = null as any;
      const getOptionName = () => 'anything';
      expect(DisplayFunctions.displayFnTooltip(option, getOptionName)).toBe(
        '-'
      );
    });

    it('should handle undefined id or text gracefully', () => {
      const optionNoId: SelectableValue = { text: 'Test Text' } as any;
      const optionNoText: SelectableValue = { id: 'test-id' } as any;
      const getOptionName: any = (opt: SelectableValue) => opt.text || '';

      expect(DisplayFunctions.displayFnTooltip(optionNoId, getOptionName)).toBe(
        '-'
      );
      expect(
        DisplayFunctions.displayFnTooltip(optionNoText, getOptionName)
      ).toBe('-');
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
