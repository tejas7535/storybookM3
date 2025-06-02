import { InputSignal, Signal, signal } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';

import { Observable, of } from 'rxjs';

import * as Utils from '../../../../../../shared/utils/validation/data-validation';
import { SelectableValue } from '../../selectable-values.utils';
import { Stub } from './../../../../../test/stub.class';
import { AbstractSingleAutocompleteComponent } from './abstract-single-autocomplete.component';

class TestComponent extends AbstractSingleAutocompleteComponent {
  protected onSearchControlChange$(
    _value: string,
    _setFormControlValue?: boolean
  ): Observable<unknown | void> {
    return of();
  }
  protected resetOptions() {}
  protected onOptionSelected() {}

  protected isPreloaded = false;
  protected filteredOptions: Signal<SelectableValue[]> = signal([]);
  public displayFn:
    | InputSignal<(option: SelectableValue | string) => string>
    | InputSignal<(option?: SelectableValue) => string> = signal(
    () => ''
  ) as any;
}

describe('AbstractSingleAutocompleteComponent', () => {
  let component: AbstractSingleAutocompleteComponent;

  beforeEach(() => {
    component = Stub.getForEffect<TestComponent>({
      component: TestComponent,
    });

    Stub.setInputs([
      { property: 'label', value: 'Any Label' },
      { property: 'control', value: new FormControl() },
      { property: 'form', value: new FormGroup({}) },
    ]);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize the control value and subscribe to valueChanges', () => {
      const mockControl = new FormControl<SelectableValue | string>(null);
      const mockForm = new FormGroup({ control: mockControl });

      Stub.setInputs([
        { property: 'form', value: mockForm },
        { property: 'control', value: mockControl },
      ]);
      Stub.detectChanges();

      jest.spyOn(mockControl.valueChanges, 'pipe').mockReturnValue(of(null));

      component.ngOnInit();

      expect(mockControl.value).toBeNull();
      expect(mockControl.valueChanges.pipe).toHaveBeenCalled();
    });
  });

  describe('onSearchFieldBlur', () => {
    it('should reset the search field if no selection was made', fakeAsync(() => {
      jest.spyOn(component as any, 'resetOptions');
      jest.spyOn(Utils, 'isEqual').mockReturnValue(false);

      component['value'] = { id: '1', text: 'Option 1' };

      const mockControl = new FormControl<SelectableValue | string>(null);
      Stub.setInputs([{ property: 'control', value: mockControl }]);

      component['onSearchFieldBlur']();

      tick(300);

      expect(mockControl.value).toEqual(component['value']);
      expect(component['resetOptions']).toHaveBeenCalled();
    }));
  });

  describe('onClear', () => {
    it('should clear the input value and emit selection change', () => {
      jest.spyOn(component.onSelectionChange, 'emit');

      component['onClear']();

      expect(component['inputValue']()).toBeNull();
      expect(component.control().value).toBeNull();
      expect(component.onSelectionChange.emit).toHaveBeenCalledWith({
        option: { id: null, text: null },
      });
    });
  });

  describe('notEmpty', () => {
    it('should return true if the control value is not empty', () => {
      const mockControl = new FormControl<SelectableValue | string>('test');
      Stub.setInputs([{ property: 'control', value: mockControl }]);
      Stub.detectChanges();

      expect(component['notEmpty']()).toBe(true);
    });

    it('should return false if the control value is empty', () => {
      const mockControl = new FormControl<SelectableValue | string>(null);
      Stub.setInputs([{ property: 'control', value: mockControl }]);
      Stub.detectChanges();

      expect(component['notEmpty']()).toBe(false);
    });
  });

  describe('getTypedValue', () => {
    it('should return the raw value of the control as SelectableValue', () => {
      const mockControl = new FormControl<SelectableValue | string>({
        id: '1',
        text: 'Option 1',
      } as SelectableValue);
      Stub.setInputs([{ property: 'control', value: mockControl }]);
      Stub.detectChanges();

      const result = component['getTypedValue']();

      expect(result).toEqual({ id: '1', text: 'Option 1' });
    });
  });

  describe('constructor', () => {
    it('should initialize the effect for filteredOptions', () => {
      const mockControl = new FormControl<SelectableValue | string>(null);
      const mockFilteredOptions = [{ id: '1', text: 'Option 1' }];
      component['filteredOptions'] = signal(mockFilteredOptions);
      component['first'] = true;

      Stub.setInputs([{ property: 'control', value: mockControl }]);
      Stub.detectChanges();

      expect(component['first']).toBe(false);
      expect(mockControl.value).toBeNull();
    });
  });
});
