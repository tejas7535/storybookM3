import { Component } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { Observable, of } from 'rxjs';

import { DisplayFunctions } from '../../../display-functions.utils';
import { SelectableValueUtils } from '../../selectable-values.utils';
import { Stub } from './../../../../../test/stub.class';
import { AbstractMultiAutocompleteComponent } from './abstract-multi-autocomplete.component';

@Component({
  selector: 'd360-any-test',
  templateUrl: './abstract-multi-autocomplete.component.html',
})
class TestComponent extends AbstractMultiAutocompleteComponent {
  protected onSearchControlChange$(_value: string): Observable<unknown | void> {
    return of();
  }
  protected resetOptions(): void {}
  protected isPreloaded = false;
}

describe('AbstractSingleAutocompleteComponent', () => {
  let component: TestComponent;
  let form: FormGroup;
  let control: FormControl;
  let searchControl: FormControl;

  beforeEach(() => {
    component = Stub.getForEffect<TestComponent>({
      component: TestComponent,
      imports: [TestComponent],
    });

    form = new FormGroup({
      control: new FormControl(null),
      searchControl: new FormControl(null),
    });
    control = form.get('control') as any;
    searchControl = form.get('searchControl') as any;

    Stub.setInputs([
      { property: 'form', value: form },
      { property: 'control', value: control },
      { property: 'searchControl', value: searchControl },
    ]);

    Stub.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getOptionName', () => {
    it('should return the default display function result', () => {
      const mockOption = { text: 'Test Option' } as any;
      const result = component.getOptionName()(mockOption);
      expect(result).toBe(DisplayFunctions.displayFnText(mockOption));
    });
  });

  describe('getOptionLabel', () => {
    it('should return the united display function result', () => {
      const mockOption = { text: 'Test Option', additionalInfo: 'Info' } as any;
      const result = component.getOptionLabel()(mockOption);
      expect(result).toBe(DisplayFunctions.displayFnUnited(mockOption));
    });
  });

  describe('ngOnInit', () => {
    it('should convert the raw value from the form control to SelectableValue[] and set it back to the form control', () => {
      const mockRawValue = { id: 1, text: 'Test' };
      const mockSelectableValue = [{ id: 1, text: 'Test' }] as any;
      jest
        .spyOn(SelectableValueUtils, 'toSelectableValueOrNull')
        .mockReturnValue(mockSelectableValue);

      control.setValue(mockRawValue);
      component.ngOnInit();

      expect(SelectableValueUtils.toSelectableValueOrNull).toHaveBeenCalledWith(
        mockRawValue,
        true
      );
      expect(control.value).toEqual(mockSelectableValue);
    });

    it('should reset the initial options based on current selected values', () => {
      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');
      component.ngOnInit();
      expect(resetOptionsSpy).toHaveBeenCalled();
    });

    it('should subscribe to value changes of the search control and handle them accordingly', fakeAsync(() => {
      const mockValue = 'searchValue';
      const handleSearchValueChangeSpy = jest
        .spyOn<any, any>(component, 'handleSearchValueChange')
        .mockReturnValue(of(mockValue));
      const onSearchControlChangeSpy = jest
        .spyOn(component as any, 'onSearchControlChange$')
        .mockReturnValue(of(true));

      component.ngOnInit();

      searchControl.setValue(mockValue);

      tick(250);

      expect(handleSearchValueChangeSpy).toHaveBeenCalledWith(mockValue);
      expect(onSearchControlChangeSpy).toHaveBeenCalledWith(mockValue, 0);
    }));
  });

  describe('handleSearchValueChange', () => {
    it('should return the search string as an observable if isPreloaded is true', () => {
      component['isPreloaded'] = true;
      const searchValue = 'test';
      const result$ = (component as any).handleSearchValueChange(searchValue);

      result$.subscribe((result: any) => {
        expect(result).toBe(searchValue);
      });
    });

    it('should set loading to true if the search string has more than one character and isPreloaded is false', () => {
      component['isPreloaded'] = false;
      const searchValue = 'test';
      const setLoadingSpy = jest.spyOn(component['loading'], 'set');

      (component as any).handleSearchValueChange(searchValue);

      expect(setLoadingSpy).toHaveBeenCalledWith(true);
    });

    it('should update tempSearchString$ with the new search value', () => {
      component['isPreloaded'] = false;
      const searchValue = 'test';
      const nextSpy = jest.spyOn(component['tempSearchString$'], 'next');

      (component as any).handleSearchValueChange(searchValue);

      expect(nextSpy).toHaveBeenCalledWith(searchValue);
    });

    it('should return an observable from debounce$ if isPreloaded is false', () => {
      component['isPreloaded'] = false;
      const debounceSpy = jest
        .spyOn(component as any, 'debounce$')
        .mockReturnValue(of('debouncedValue'));

      const result$ = (component as any).handleSearchValueChange('test');

      result$.subscribe((result: any) => {
        expect(result).toBe('debouncedValue');
      });
      expect(debounceSpy).toHaveBeenCalled();
    });
  });

  describe('onClear', () => {
    beforeEach(() => {
      (component as any)['trigger'] = { closePanel: () => {} };
    });

    it('should clear the control value', () => {
      control.setValue([{ id: 1, text: 'Test' }]);
      component['onClear']();
      expect(control.value).toEqual([]);
    });

    it('should set isInputFocused to false', () => {
      component['isInputFocused'] = true;
      component['onClear']();
      expect(component['isInputFocused']).toBe(false);
    });

    it('should close the autocomplete panel', () => {
      const closePanelSpy = jest.spyOn(component['trigger'], 'closePanel');
      component['onClear']();
      expect(closePanelSpy).toHaveBeenCalled();
    });
  });

  describe('onOptionSelected', () => {
    beforeEach(() => {
      (component as any)['input'] = { nativeElement: { value: '' } };
      jest.spyOn(component as any, 'resetOptions').mockImplementation();
    });

    it('should add the selected option to the control value', () => {
      control.setValue([{ id: 1, text: 'Option 1' }]);
      const event = {
        option: { value: { id: 2, text: 'Option 2' } },
      } as MatAutocompleteSelectedEvent;

      component['onOptionSelected'](event);

      expect(control.value).toEqual([
        { id: 1, text: 'Option 1' },
        { id: 2, text: 'Option 2' },
      ]);
    });

    it('should set isInputFocused to true', () => {
      const event = {
        option: { value: { id: 2, text: 'Option 2' } },
      } as MatAutocompleteSelectedEvent;

      component['onOptionSelected'](event);

      expect(component['isInputFocused']).toBe(true);
    });

    it('should clear the input field value', () => {
      const event = {
        option: { value: { id: 2, text: 'Option 2' } },
      } as MatAutocompleteSelectedEvent;

      component['onOptionSelected'](event);

      expect(component['input'].nativeElement.value).toBe(null);
    });

    it('should reset the search control value', () => {
      searchControl.setValue('test');
      const event = {
        option: { value: { id: 2, text: 'Option 2' } },
      } as MatAutocompleteSelectedEvent;

      component['onOptionSelected'](event);

      expect(searchControl.value).toBe(null);
    });

    it('should call resetOptions', () => {
      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');
      const event = {
        option: { value: { id: 2, text: 'Option 2' } },
      } as MatAutocompleteSelectedEvent;

      component['onOptionSelected'](event);

      expect(resetOptionsSpy).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'resetOptions').mockImplementation();
    });

    it('should remove the specified option from the control value', () => {
      const optionToRemove = { id: 2, text: 'Option 2' } as any;
      control.setValue([
        { id: 1, text: 'Option 1' },
        optionToRemove,
        { id: 3, text: 'Option 3' },
      ]);

      component['remove'](optionToRemove);

      expect(control.value).toEqual([
        { id: 1, text: 'Option 1' },
        { id: 3, text: 'Option 3' },
      ]);
    });

    it('should not modify the control value if the option is not found', () => {
      const optionToRemove = { id: 4, text: 'Option 4' } as any;
      const initialValue = [
        { id: 1, text: 'Option 1' },
        { id: 2, text: 'Option 2' },
        { id: 3, text: 'Option 3' },
      ];
      control.setValue(initialValue);

      component['remove'](optionToRemove);

      expect(control.value).toEqual(initialValue);
    });

    it('should call resetOptions after removing the option', () => {
      const optionToRemove = { id: 2, text: 'Option 2' } as any;
      control.setValue([
        { id: 1, text: 'Option 1' },
        optionToRemove,
        { id: 3, text: 'Option 3' },
      ]);

      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');

      component['remove'](optionToRemove);

      expect(resetOptionsSpy).toHaveBeenCalled();
    });
  });

  describe('onFocus', () => {
    it('should set isInputFocused to true', () => {
      component['isInputFocused'] = false;

      component['onFocus']();

      expect(component['isInputFocused']).toBe(true);
    });
  });

  describe('onBlur', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should set isInputFocused to false after a short timeout', () => {
      component['isInputFocused'] = true;

      component['onBlur']();

      expect(component['isInputFocused']).toBe(true); // Still true immediately after calling onBlur
      jest.advanceTimersByTime(100); // Simulate the timeout
      expect(component['isInputFocused']).toBe(false);
    });
  });

  describe('onInputClick', () => {
    beforeEach(() => {
      jest.spyOn(component as any, 'onAutocompleteOpened').mockImplementation();
    });

    it('should call onAutocompleteOpened if isAutocompleteOpen is false', () => {
      component['isAutocompleteOpen'] = false;

      component['onInputClick']();

      expect(component['onAutocompleteOpened']).toHaveBeenCalled();
    });

    it('should not call onAutocompleteOpened if isAutocompleteOpen is true', () => {
      component['isAutocompleteOpen'] = true;

      component['onInputClick']();

      expect(component['onAutocompleteOpened']).not.toHaveBeenCalled();
    });
  });

  describe('onAutocompleteOpened', () => {
    it('should set isAutocompleteOpen to true', () => {
      component['isAutocompleteOpen'] = false;

      component['onAutocompleteOpened']();

      expect(component['isAutocompleteOpen']).toBe(true);
    });
  });

  describe('onAutocompleteClosed', () => {
    it('should set isAutocompleteOpen to false', () => {
      component['isAutocompleteOpen'] = true;

      component['onAutocompleteClosed']();

      expect(component['isAutocompleteOpen']).toBe(false);
    });
  });

  describe('constructor', () => {
    it('should initialize with optionsLoadingResult and reset initial values if first is true', () => {
      const mockOptions = { options: [{ id: 1, text: 'Option 1' }] } as any;
      const mockRawValue = [{ id: 2, text: 'Option 2' }] as any;
      const mockMappedValue = [{ id: 1, text: 'Option 1' }] as any;

      jest
        .spyOn(SelectableValueUtils, 'mapToOptionsIfPossible')
        .mockReturnValue(mockMappedValue);
      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');

      component['first'] = true;

      Stub.setInput('optionsLoadingResult', mockOptions);
      control.setValue(mockRawValue);

      // Trigger the effect
      Stub.detectChanges();

      expect(SelectableValueUtils.mapToOptionsIfPossible).toHaveBeenCalledWith(
        mockRawValue,
        [{ id: 1, text: 'Option 1' }]
      );
      expect(control.value).toEqual(mockMappedValue);
      expect(resetOptionsSpy).toHaveBeenCalled();
      expect(component['first']).toBe(false);
    });

    it('should not reset initial values if first is false', () => {
      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');
      component['first'] = false;

      // Trigger the effect
      Stub.detectChanges();

      expect(resetOptionsSpy).not.toHaveBeenCalled();
    });

    it('should handle raw value as a string and map it to options if the string has a length greater than 0', () => {
      const mockOptions = { options: [{ id: 1, text: 'Option 1' }] } as any;
      const mockRawValue = 'Test String';
      const mockMappedValue = [{ id: 1, text: 'Option 1' }] as any;

      jest
        .spyOn(SelectableValueUtils, 'mapToOptionsIfPossible')
        .mockReturnValue(mockMappedValue);
      const resetOptionsSpy = jest.spyOn(component as any, 'resetOptions');

      component['first'] = true;

      Stub.setInput('optionsLoadingResult', mockOptions);
      control.setValue(mockRawValue);

      // Trigger the effect
      Stub.detectChanges();

      expect(SelectableValueUtils.mapToOptionsIfPossible).toHaveBeenCalledWith(
        [mockRawValue],
        [{ id: 1, text: 'Option 1' }]
      );
      expect(control.value).toEqual(mockMappedValue);
      expect(resetOptionsSpy).toHaveBeenCalled();
      expect(component['first']).toBe(false);
    });
  });
});
