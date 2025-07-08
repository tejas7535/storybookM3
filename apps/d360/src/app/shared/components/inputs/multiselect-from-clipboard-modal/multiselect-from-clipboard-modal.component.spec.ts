import { FormControl, FormGroup } from '@angular/forms';

import { Stub } from '../../../test/stub.class';
import { MultiselectFromClipboardModalComponent } from './multiselect-from-clipboard-modal.component';

describe('MultiselectFromClipboardModalComponent', () => {
  let component: MultiselectFromClipboardModalComponent;

  beforeEach(() => {
    component = Stub.get<MultiselectFromClipboardModalComponent>({
      component: MultiselectFromClipboardModalComponent,
      providers: [
        Stub.getMatDialogDataProvider({
          control: new FormControl([]),
          form: new FormGroup({}),
          selectableValuesByKeys: jest.fn(),
          entityName: 'test',
          entityNamePlural: 'tests',
          autocompleteLabel: 'Select...',
          getOptionLabelInTag: jest.fn(),
          optionsLoadingResults: {},
          getOptionLabel: jest.fn(),
          urlBegin: 'https://',
        }),
      ],
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('pasteFromClipboard', () => {
    beforeEach(() => {
      // Mock clipboard API
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          readText: jest.fn(),
        },
        configurable: true,
      });
    });

    it('should process clipboard data and set valid values', async () => {
      const clipboardText = 'value1\nvalue2\tvalue3\r\nvalue4';
      const selectableValues = [
        { id: 'value1', name: 'Value 1', displayValue: 'Value 1' },
        { id: 'value3', name: 'Value 3', displayValue: 'Value 3' },
      ];
      const results = [
        { id: 'value1', selectableValue: selectableValues[0] },
        { id: 'value2', error: ['Value not found'] },
        { id: 'value3', selectableValue: selectableValues[1] },
        { id: 'value4', error: ['Invalid format'] },
      ];

      navigator.clipboard.readText = jest.fn().mockResolvedValue(clipboardText);
      component.data.selectableValuesByKeys = jest.fn().mockReturnValue({
        pipe: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        delay: jest.fn().mockReturnThis(),
        finalize: jest.fn().mockReturnThis(),
        subscribe: jest.fn().mockImplementation((fn) => fn(results)),
      });

      // Spy on set method of signals
      const loadingSpy = jest.spyOn(component['loading'], 'set');
      const clipboardErrorsSpy = jest.spyOn(
        component['clipboardErrors'],
        'set'
      );
      const setValueSpy = jest.spyOn(component.unsavedValues, 'setValue');

      await component['pasteFromClipboard']();

      expect(navigator.clipboard.readText).toHaveBeenCalled();
      expect(component.data.selectableValuesByKeys).toHaveBeenCalledWith([
        'value1',
        'value2',
        'value3',
        'value4',
      ]);
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(clipboardErrorsSpy).toHaveBeenCalledWith({
        messages: ['Value not found', 'Invalid format'],
        ignoredValues: ['value2', 'value4'],
      });
      expect(setValueSpy).toHaveBeenCalledWith(selectableValues);
    });

    it('should handle errors when reading from clipboard', async () => {
      const error = new Error('Clipboard error');
      navigator.clipboard.readText = jest.fn().mockRejectedValue(error);
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      const loadingSpy = jest.spyOn(component['loading'], 'set');

      await component['pasteFromClipboard']();

      expect(navigator.clipboard.readText).toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(error);
      expect(loadingSpy).toHaveBeenCalledWith(true);
      expect(loadingSpy).toHaveBeenCalledWith(false);
    });
  });

  describe('resetSelection', () => {
    it('should clear errors and reset unsavedValues', () => {
      const clipboardErrorsSpy = jest.spyOn(
        component['clipboardErrors'],
        'set'
      );
      const resetSpy = jest.spyOn(component.unsavedValues, 'reset');
      const setValueSpy = jest.spyOn(component.unsavedValues, 'setValue');

      component['resetSelection']();

      expect(clipboardErrorsSpy).toHaveBeenCalledWith({
        messages: [],
        ignoredValues: [],
      });
      expect(resetSpy).toHaveBeenCalled();
      expect(setValueSpy).toHaveBeenCalledWith([]);
    });
  });

  describe('applySelection', () => {
    it('should set control value and clear errors', () => {
      const testValues = [{ id: '1', name: 'Test' }];
      component.unsavedValues.setValue(testValues);
      const setValueSpy = jest.spyOn(component.data.control, 'setValue');
      const clipboardErrorsSpy = jest.spyOn(
        component['clipboardErrors'],
        'set'
      );

      component['applySelection']();

      expect(setValueSpy).toHaveBeenCalledWith(testValues);
      expect(clipboardErrorsSpy).toHaveBeenCalledWith({
        messages: [],
        ignoredValues: [],
      });
    });
  });

  describe('deduplicateSelectableValues', () => {
    it('should remove duplicate entries based on id', () => {
      const values = [
        { id: '1', name: 'Value 1' },
        { id: '2', name: 'Value 2' },
        { id: '1', name: 'Value 1 Duplicate' },
        { id: '3', name: 'Value 3' },
      ];

      // Access private method using type assertion
      const result = (component as any).deduplicateSelectableValues(values);

      expect(result).toHaveLength(3);
      expect(result).toEqual([
        { id: '1', name: 'Value 1' },
        { id: '2', name: 'Value 2' },
        { id: '3', name: 'Value 3' },
      ]);
    });
  });
});
