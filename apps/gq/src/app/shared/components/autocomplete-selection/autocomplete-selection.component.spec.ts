import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
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
    test('should set not FoundError when allowOptionsValuesOnly is true', (done) => {
      spectator.setInput('allowOptionsValuesOnly', true);
      component.ngOnInit();
      component['valueNotFound'] = jest.fn(() => true);
      component.formControl.setValue('test');
      spectator.detectChanges();
      setTimeout(() => {
        expect(component.formControl.errors).toEqual({ notFound: true });
        done();
      }, 500);
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

  describe('onBlur', () => {
    beforeEach(() => {
      component['onTouched'] = jest.fn();
    });
    test('should have called the defaultValueSelection', () => {
      component['handleDefaultValueWhenEmptyInput'] = jest.fn();
      component.onBlur();
      expect(component['handleDefaultValueWhenEmptyInput']).toHaveBeenCalled();
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

  describe('validation', () => {
    beforeEach(() => {
      component = spectator.debugElement.componentInstance;
      component.formControl?.clearValidators();
    });
    // emission of value from ValueChanges is quite wild
    // with calling onInit, wait, setValue, wait, setValue wait again, all action to beforehand will be performed
    // so that the validation can be unitTested
    // for following this logic add a console.log in the valueChanges subscription
    // and subscribe to the valueChanges here in the test
    // ``` component.formControl.valueChanges.subscribe((data) =>
    //    console.log('subscribed from test', data)
    //  );```
    test('should set an error when allowOptionsValuesOnly is true', fakeAsync(() => {
      component.ngOnInit();
      tick(300);
      component.formControl.setValue('test2');
      tick(300);
      component.formControl.setValue('test2');
      expect(component.formControl.errors).toEqual({ notFound: true });
    }));
    test('should set error when required and value is empty', fakeAsync(() => {
      spectator.setInput('isRequired', () => true);
      component.ngOnInit();
      tick(300);
      component.formControl.setValue('');
      tick(300);

      expect(component.formControl.errors).toEqual({ required: true });
    }));
    test('should set an error when required but value is not in the options list', fakeAsync(() => {
      spectator.setInput('isRequired', () => true);
      spectator.setInput('allowOptionsValuesOnly', () => true);
      component.ngOnInit();
      tick(300);
      component.formControl.setValue('test2');
      tick(300);
      expect(component.formControl.errors).toEqual({ wrongSelection: true });
    }));
    test('should not set an error when required and value is in the options list', fakeAsync(() => {
      spectator.setInput('isRequired', () => true);
      component.ngOnInit();
      tick(300);
      component.formControl.setValue('value');
      tick(300);
      expect(component.formControl.errors).toEqual(null);
    }));
    test('should not set an error when allowOptionsValuesOnly is false', fakeAsync(() => {
      spectator.setInput('allowOptionsValuesOnly', false);
      component.ngOnInit();
      tick(300);
      component.formControl.setValue('test2');
      tick(300);
      expect(component.formControl.errors).toEqual(null);
    }));
    test('should not set an error when allowOptionsValuesOnly is false and value is in the options list', fakeAsync(() => {
      spectator.setInput('allowOptionsValuesOnly', false);
      component.ngOnInit();
      tick(300);
      component.formControl.setValue('value');
      tick(300);
      expect(component.formControl.errors).toEqual(null);
    }));
  });
});
