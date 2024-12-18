import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl } from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';

import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import * as miscUtils from '@gq/shared/utils/misc.utils';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteSelectionComponent } from './autocomplete-selection.component';

class MockNgControl extends NgControl {
  control = new FormControl('');

  viewToModelUpdate(_newValue: any): void {}

  override valueAccessor: ControlValueAccessor = {
    writeValue: () => {},
    registerOnChange: () => {},
    registerOnTouched: () => {},
  };
}

describe('AutocompleteSelectionComponent', () => {
  let component: AutocompleteSelectionComponent;
  let spectator: Spectator<AutocompleteSelectionComponent>;

  const createComponent = createComponentFactory({
    component: AutocompleteSelectionComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} })],
    overrideComponents: [
      [
        AutocompleteSelectionComponent,
        {
          add: {
            providers: [
              {
                provide: NgControl,
                useClass: MockNgControl,
              },
            ],
          },
        },
      ],
    ],
  });

  beforeEach(() => {
    jest.resetAllMocks();
    const value: SelectableValue = {
      id: '1',
      value: 'value',
      value2: 'value2',
      defaultSelection: true,
    };

    spectator = createComponent({
      props: {
        label: 'Label',
        options: [value],
      },
    });

    component = spectator.debugElement.componentInstance;
    component['onChange'] = jest.fn();
    spectator.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Accessor functions', () => {
    test('registerOnChange should set onChange', () => {
      const onChange = jest.fn();
      component.registerOnChange(onChange);
      expect(component['onChange']).toEqual(onChange);
    });

    test('registerOnTouched should set onTouched', () => {
      const onTouched = jest.fn();
      component.registerOnTouched(onTouched);
      expect(component['onTouched']).toEqual(onTouched);
    });

    test('setDisabledState should set the disabled state to true', () => {
      component.setDisabledState(true);
      expect(component.isDisabled).toEqual(true);
    });
    test('setDisabledState should set the disabled state to false', () => {
      component.setDisabledState(false);
      expect(component.isDisabled).toEqual(false);
    });
  });

  describe('onOptionSelected', () => {
    test('should call onChange', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();

      const args: MatAutocompleteSelectedEvent = {
        source: {} as MatAutocomplete,
        option: {
          value: {
            id: '1',
            value: 'value',
          } as SelectableValue,
        } as MatOption<SelectableValue>,
      };
      component.onOptionSelected(args);
      expect(component['onChange']).toHaveBeenCalled();
      expect(component['onTouched']).toHaveBeenCalled();
    });
  });

  describe('displayFn', () => {
    test('should call displaySelectableValue function', () => {
      const spy = jest.spyOn(miscUtils, 'displaySelectableValue');

      const selectableValue: SelectableValue = {
        id: '1',
        value: 'value',
      };

      component.displayFn(selectableValue);
      expect(spy).toHaveBeenCalledWith(selectableValue);
    });
  });

  describe('defaultSelection$', () => {
    test('should set form control value to defaultSelection', (done) => {
      const defaultValue: SelectableValue = {
        id: '1',
        value: 'value',
        value2: 'value2',
        defaultSelection: true,
      };

      component.defaultSelection$.subscribe((val) => {
        expect(val).toEqual(defaultValue);
        done();
      });
    });
  });

  describe('formControl', () => {
    test('should set filteredOptions and set error', (done) => {
      component.ngOnInit();
      component.formControl.setValue('test');
      setTimeout(() => {
        expect(component.filteredOptions().length).toEqual(0);
        expect(component.formControl.errors).toEqual({ notFound: true });
        done();
      }, component['debounceTime']);
    });
    test('should set filteredOptions and set error to null', (done) => {
      component.ngOnInit();
      component.formControl.setValue('value');
      setTimeout(() => {
        expect(component.filteredOptions().length).toEqual(1);
        expect(component.formControl.errors).toEqual(null);
        done();
      }, component['debounceTime']);
    });
    test('should set filteredOptions when id is passed', (done) => {
      component.ngOnInit();
      component.formControl.setValue('1');
      setTimeout(() => {
        expect(component.filteredOptions().length).toEqual(1);
        done();
      }, component['debounceTime']);
    });
    test('should set filteredOptions when value is passed', (done) => {
      component.ngOnInit();
      component.formControl.setValue('value');
      setTimeout(() => {
        expect(component.filteredOptions().length).toEqual(1);
        done();
      }, component['debounceTime']);
    });
    test('should set filteredOptions when value2 is passed', (done) => {
      component.ngOnInit();
      component.formControl.setValue('value2');
      setTimeout(() => {
        expect(component.filteredOptions().length).toEqual(1);
        done();
      }, component['debounceTime']);
    });
    test('should set filteredOptions when values is selected', (done) => {
      component.ngOnInit();
      const selectableValue: SelectableValue = {
        id: '1',
        value: 'value',
      };
      component.formControl.setValue(selectableValue);
      setTimeout(() => {
        expect(component.filteredOptions().length).toEqual(1);
        done();
      }, component['debounceTime']);
    });
  });

  describe('writeValue function', () => {
    test('should set value to null when id is not present', () => {
      const value: SelectableValue = {
        id: undefined,
        value: 'value',
        value2: 'value2',
      };
      component.writeValue(value);
      expect(component.getSelectedValue()).toEqual(null);
    });
    test('should set selected value to null when null is passed', () => {
      component.writeValue(null);
      expect(component.getSelectedValue()).toEqual(null);
    });
  });
  describe('handleErrors', () => {
    test('should set error when value is not found', () => {
      component.filteredOptions.set([]);
      component.handleErrors('test');
      expect(component.formControl.errors).toEqual({ notFound: true });
    });
    test('should set error when value object is not found', () => {
      const value: SelectableValue = {
        id: '1',
        value: 'value',
        value2: 'value2',
      };
      component.filteredOptions.set([value]);
      const searchValue: SelectableValue = {
        id: '2',
        value: 'value',
        value2: 'value2',
      };
      component.handleErrors(searchValue);
      expect(component.formControl.errors).toEqual({ notFound: true });
    });
    test('should set error to null when value is found', () => {
      const value: SelectableValue = {
        id: '1',
        value: 'value',
        value2: 'value2',
      };
      component.filteredOptions.set([value]);
      component.handleErrors('value');
      expect(component.formControl.errors).toEqual(null);
    });
  });
});
