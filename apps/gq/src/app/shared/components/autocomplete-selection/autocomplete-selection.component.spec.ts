import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  FormBuilder,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatOption } from '@angular/material/core';

import { SelectableValue } from '@gq/shared/models/selectable-value.model';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteSelectionComponent } from './autocomplete-selection.component';

describe('AutocompleteSelectionComponent', () => {
  let component: AutocompleteSelectionComponent;
  let spectator: Spectator<AutocompleteSelectionComponent>;
  let option: SelectableValue;

  const fb = new FormBuilder();

  const formGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = fb.group({
    test: fb.control(null),
  });

  const createComponent = createComponentFactory({
    component: AutocompleteSelectionComponent,
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    detectChanges: false,
    imports: [provideTranslocoTestingModule({ en: {} }), ReactiveFormsModule],
    providers: [
      {
        provide: FormGroupDirective,
        useValue: formGroupDirective,
      },
    ],
  });

  beforeEach(() => {
    jest.resetAllMocks();
    option = {
      id: '1',
      value: 'value',
      value2: 'value2',
      defaultSelection: true,
    };

    spectator = createComponent({
      props: {
        label: 'Label',
        options: [option],
        isEditMode: false,
        formControlName: 'test',
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
    test('should set filteredOptions when option is passed', (done) => {
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
    test('should set option automatically when only one option is available', (done) => {
      component.ngOnInit();
      component.formControl.setValue('value');
      setTimeout(() => {
        expect(component.formControl.value).toEqual({
          id: '1',
          value: 'value',
          value2: 'value2',
          defaultSelection: true,
        });
        done();
      }, component['debounceTime']);
    });
    test('should not set option automatically when only one option is available butallowOptionsValuesOnly is false', (done) => {
      component.ngOnInit();
      spectator.setInput('allowOptionsValuesOnly', false);
      component.formControl.setValue('value');
      setTimeout(() => {
        expect(component.formControl.value).toEqual('value');
        done();
      }, component['debounceTime']);
    });

    test('should not set option automatically when only one option is available but passed option is null', (done) => {
      component.ngOnInit();
      component.formControl.setValue(null);
      setTimeout(() => {
        expect(component.formControl.value).toEqual(null);
        done();
      }, component['debounceTime']);
    });
    test('should not set option automatically when only one option is available but passed option is empty string', (done) => {
      component.ngOnInit();
      component.formControl.setValue('');
      setTimeout(() => {
        expect(component.formControl.value).toEqual('');
        done();
      }, component['debounceTime']);
    });
  });

  describe('getFormControlValueLength', () => {
    test('should return 0 when formControl value is null', () => {
      component.formControl.setValue(null);
      expect(component.getFormControlValueLength()).toEqual(0);
    });
    test('should return  when formControl value is string', () => {
      component.formControl.setValue('test');
      expect(component.getFormControlValueLength()).toEqual(4);
    });
    test('should return when formControl value is object', () => {
      const value: SelectableValue = {
        id: '1',
        value: 'value',
        value2: 'value2',
      };
      spectator.setInput(
        'customDisplayFunction',
        (v: SelectableValue) => v.value2
      );

      component.formControl.setValue(value);
      expect(component.getFormControlValueLength()).toEqual('value2'.length);
    });
  });

  describe('writeValue function', () => {
    test('should set option to null when id is not present', () => {
      const value: SelectableValue = {
        id: undefined,
        value: 'value',
        value2: 'value2',
      };
      component.writeValue(value);
      expect(component.getSelectedValue()).toEqual(null);
    });
    test('should set selected option to null when null is passed', () => {
      component.writeValue(null);
      expect(component.getSelectedValue()).toEqual(null);
    });
  });
  describe('handleErrors', () => {
    test('should set error when option is not found', () => {
      component.filteredOptions.set([]);
      component.handleErrors('test');
      expect(component.formControl.errors).toEqual({ notFound: true });
    });
    test('should set error when option object is not found', () => {
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
    test('should set error to null when option is found', () => {
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
  describe('onBlur', () => {
    beforeEach(() => {
      component['onTouched'] = jest.fn();
    });
    test('should not set error on blur when allowOptionsValuesOnly is false', () => {
      spectator.setInput('allowOptionsValuesOnly', false);
      component.formControl.setValue('test');
      component.onBlur();
      expect(component.formControl.errors).toEqual(null);
    });
    test('should set error on blur when selection is a string', () => {
      component.formControl.setValue('test');
      component.onBlur();
      expect(component.formControl.errors).toEqual({ wrongSelection: true });
      expect(component['onTouched']).toHaveBeenCalled();
    });
    test('should not set error on blur when input option is empty', () => {
      component.formControl.setValue('');
      component.onBlur();
      expect(component.formControl.errors).toEqual(null);
      expect(component['onTouched']).toHaveBeenCalled();
    });
    test('should not set error on blur when object is selected', () => {
      const value = component.options()[0];
      component.filteredOptions.set([value]);
      component.formControl.setValue(value);
      component.onBlur();
      expect(component.formControl.errors).toEqual(null);
      expect(component['onTouched']).toHaveBeenCalled();
    });
    test('should set error on blur when selected object is not found', () => {
      const value: SelectableValue = {
        id: '1',
        value: 'valueNotFound',
        value2: 'value2NotFound',
      };
      component.formControl.setValue(value);
      component.onBlur();
      expect(component.formControl.errors).toEqual({ wrongSelection: true });
      expect(component['onTouched']).toHaveBeenCalled();
    });
    test('should set error on blur when value is empty but required', () => {
      spectator.setInput('isRequired', () => true);
      component.formControl.setValue('');
      component.onBlur();
      expect(component.formControl.errors).toEqual({ required: true });
      expect(component['onTouched']).toHaveBeenCalled();
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

  describe('defaultSelection$', () => {
    test('should set form control option to defaultSelection', (done) => {
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

  describe('initalValue$', () => {
    test('should set form control value', (done) => {
      spectator.setInput('initalValue', 'x');
      component.initialValue$.subscribe((val) => {
        expect(val).toEqual('x');
        expect(component.formControl.value).toEqual({
          id: null,
          value: null,
          value2: 'x',
        });
        done();
      });
    });
  });

  describe('options$', () => {
    test('should set filtered options to options and set selected option to null when edit mode is false', () => {
      component.filteredOptions.set = jest.fn();
      component.setSelectedValue = jest.fn();
      component.ngOnInit();

      expect(component.filteredOptions.set).toHaveBeenCalledWith([option]);
      expect(component.setSelectedValue).toHaveBeenCalledWith(null);
    });
  });
});
