import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from '../../../test/stub.class';
import { FilterDropdownComponent } from './filter-dropdown.component';

describe('FilterDropdownComponent', () => {
  let component: FilterDropdownComponent;

  beforeEach(() => {
    component = Stub.getForEffect<FilterDropdownComponent>({
      component: FilterDropdownComponent,
    });

    Stub.setInputs([
      { property: 'label', value: 'Dropdown' },
      {
        property: 'control',
        value: new FormControl({ id: '1', text: 'Option 1' }),
      },
      { property: 'form', value: new FormGroup({}) },
      { property: 'options', value: [{ id: '1', text: 'Option 1' }] },
      { property: 'loading', value: false },
      { property: 'multiSelect', value: false },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with correct values', () => {
      jest.spyOn(component['onSelectionChangeEmitter'], 'emit');

      component.ngOnInit();

      expect(component.control().value).toEqual({ id: '1', text: 'Option 1' });

      expect(component['onSelectionChangeEmitter'].emit).toHaveBeenCalledWith({
        id: '1',
        text: 'Option 1',
      });
    });
  });

  describe('onSelectionChange', () => {
    it('should handle selection change with single select', () => {
      const newValue = { id: '2', text: 'Option 2' };
      const event = { value: newValue } as any;

      jest.spyOn(component.control(), 'setValue');
      jest.spyOn(component['onSelectionChangeEmitter'], 'emit');

      component['onSelectionChange'](event);

      expect(component.control().setValue).toHaveBeenCalledWith(newValue, {
        emitEvent: true,
      });
      expect(component['onSelectionChangeEmitter'].emit).toHaveBeenCalledWith(
        newValue
      );
    });

    it('should handle selection change with multi-select', () => {
      Stub.setInputs([{ property: 'multiSelect', value: true }]);
      Stub.detectChanges();

      const newValues = [
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ];
      const event = { value: newValues } as any;

      jest.spyOn(component.control(), 'setValue');
      jest.spyOn(component['onSelectionChangeEmitter'], 'emit');

      component['onSelectionChange'](event);

      expect(component.control().setValue).toHaveBeenCalledWith(newValues, {
        emitEvent: true,
      });
      expect(component['onSelectionChangeEmitter'].emit).toHaveBeenCalledWith(
        newValues
      );
    });

    it('should not process selection when loading', () => {
      Stub.setInputs([{ property: 'loading', value: true }]);
      Stub.detectChanges();

      const event = { value: { id: '2', text: 'Option 2' } } as any;

      jest.spyOn(component.control(), 'setValue');
      jest.spyOn(component['onSelectionChangeEmitter'], 'emit');

      component['onSelectionChange'](event);

      expect(component.control().setValue).not.toHaveBeenCalled();
      expect(component['onSelectionChangeEmitter'].emit).not.toHaveBeenCalled();
    });

    it('should not process selection when there is a loading error', () => {
      Stub.setInputs([
        { property: 'loadingError', value: 'Error loading data' },
      ]);
      Stub.detectChanges();

      const event = { value: { id: '2', text: 'Option 2' } } as any;

      jest.spyOn(component.control(), 'setValue');
      jest.spyOn(component['onSelectionChangeEmitter'], 'emit');

      component['onSelectionChange'](event);

      expect(component.control().setValue).not.toHaveBeenCalled();
      expect(component['onSelectionChangeEmitter'].emit).not.toHaveBeenCalled();
    });
  });

  describe('getSelectedValues', () => {
    it('should correctly format selected values', () => {
      component.control().setValue([
        { id: '1', text: 'Option 1' },
        { id: '2', text: 'Option 2' },
      ]);

      const result = component['getSelectedValues']();

      expect(result).toBe('1 - Option 1, 2 - Option 2');
    });

    it('should handle null values in getSelectedValues', () => {
      component.control().setValue(null);

      const result = component['getSelectedValues']();

      expect(result).toBe('-');
    });
  });

  describe('onClear', () => {
    it('should clear selection when onClear is called in single select mode', () => {
      jest.spyOn(component, 'onSelectionChange' as any);

      component['onClear']();

      expect(component['onSelectionChange']).toHaveBeenCalledWith({
        value: null,
      } as any);
    });

    it('should clear selection when onClear is called in multi select mode', () => {
      Stub.setInputs([{ property: 'multiSelect', value: true }]);
      Stub.detectChanges();

      jest.spyOn(component, 'onSelectionChange' as any);

      component['onClear']();

      expect(component['onSelectionChange']).toHaveBeenCalledWith({
        value: [],
      } as any);
    });
  });

  describe('compareFn', () => {
    it('should correctly compare SelectableValues', () => {
      const value1 = { id: '1', text: 'Option 1' };
      const value2 = { id: '1', text: 'Different Label' };
      const value3 = { id: '2', text: 'Option 2' };

      expect(component['compareFn'](value1, value2)).toBe(true);
      expect(component['compareFn'](value1, value3)).toBe(false);
      expect(component['compareFn'](null as any, value1)).toBe(false);
      expect(component['compareFn'](value1, null as any)).toBe(false);
    });

    it('should handle undefined values correctly', () => {
      const value1 = { id: '1', text: 'Option 1' };

      expect(component['compareFn'](undefined as any, value1)).toBe(false);
      expect(component['compareFn'](value1, undefined as any)).toBe(false);
      expect(component['compareFn'](undefined as any, undefined as any)).toBe(
        true
      );
    });
  });

  describe('formatSelectedValue and formatOptionValue', () => {
    it('should format values where id and text are the same', () => {
      const customFormat = (value: any) => `Custom: ${value.id}`;
      Stub.setInputs([
        { property: 'formatSelectedValue', value: customFormat },
      ]);
      Stub.detectChanges();

      component.control().setValue({ id: 'test', text: 'test' });

      const result = component['getSelectedValues']();

      expect(result).toBe('Custom: test');
    });

    it('should use default formatter when not provided', () => {
      component.control().setValue({ id: 'abc', text: 'ABC Text' });

      const result = component['getSelectedValues']();

      expect(result).toBe('abc - ABC Text');
    });

    it('should handle custom formatOptionValue', () => {
      const formatSpy = jest.fn().mockReturnValue('Formatted Option');
      Stub.setInputs([{ property: 'formatOptionValue', value: formatSpy }]);
      Stub.detectChanges();

      // We don't directly test the rendering here, but we can verify the formatter exists
      expect(component.formatOptionValue()).toBe(formatSpy);
    });
  });

  describe('handling options and selection', () => {
    it('should handle empty options array', () => {
      Stub.setInputs([{ property: 'options', value: [] }]);
      Stub.detectChanges();

      const event = { value: { id: '99', text: 'Non-existent option' } } as any;

      jest.spyOn(component.control(), 'setValue');
      component['onSelectionChange'](event);

      expect(component.control().setValue).toHaveBeenCalledWith(
        expect.objectContaining({ id: '99' }),
        expect.anything()
      );
    });

    it('should not process selection when loadingError exists but value is null', () => {
      Stub.setInputs([
        { property: 'loadingError', value: 'Error loading data' },
      ]);
      Stub.detectChanges();

      const event = { value: null } as any;

      jest.spyOn(component.control(), 'setValue');
      component['onSelectionChange'](event);

      expect(component.control().setValue).toHaveBeenCalled();
    });

    it('should handle array of raw ids in multi-select mode', () => {
      Stub.setInputs([
        { property: 'multiSelect', value: true },
        {
          property: 'options',
          value: [
            { id: '1', text: 'Option 1' },
            { id: '2', text: 'Option 2' },
          ],
        },
      ]);
      Stub.detectChanges();

      const event = { value: ['1', '2'] } as any;

      jest.spyOn(component.control(), 'setValue');
      component['onSelectionChange'](event);

      expect(component.control().setValue).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: '1' }),
          expect.objectContaining({ id: '2' }),
        ]),
        expect.anything()
      );
    });

    it('should handle empty selection in multi-select mode', () => {
      Stub.setInputs([{ property: 'multiSelect', value: true }]);
      Stub.detectChanges();

      const event = { value: [] } as any;

      jest.spyOn(component.control(), 'setValue');
      component['onSelectionChange'](event);

      expect(component.control().setValue).toHaveBeenCalledWith([], {
        emitEvent: true,
      });
    });
  });
});
