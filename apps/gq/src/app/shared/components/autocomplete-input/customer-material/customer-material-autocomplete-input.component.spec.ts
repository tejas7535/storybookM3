import { AbstractControl } from '@angular/forms';

import { IdValue } from '@gq/shared/models/search';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterNames } from '../filter-names.enum';
import { MaterialAutocompleteUtilsService } from '../material-autocomplete-utils.service';
import { NoResultsFoundPipe } from '../pipes/no-results-found.pipe';
import { CustomerMaterialAutoCompleteInputComponent } from './customer-material-autocomplete-input.component';

describe('CustomerMaterialAutoCompleteInputComponent', () => {
  let spectator: Spectator<CustomerMaterialAutoCompleteInputComponent>;
  let component: CustomerMaterialAutoCompleteInputComponent;

  let materialUtils: MaterialAutocompleteUtilsService;

  const createComponent = createComponentFactory({
    component: CustomerMaterialAutoCompleteInputComponent,
    declarations: [NoResultsFoundPipe],
    imports: [PushPipe, provideTranslocoTestingModule({ en: {} })],
    detectChanges: false,
    providers: [mockProvider(MaterialAutocompleteUtilsService)],
  });

  beforeEach(() => {
    jest.resetAllMocks();
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    materialUtils = spectator.inject(MaterialAutocompleteUtilsService);
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should set correct filter name', () => {
    expect(component.filterName).toEqual(FilterNames.CUSTOMER_MATERIAL);
  });

  describe('shouldEmitAutocomplete', () => {
    test('should call emitIsValidOnFormInput and the super method', () => {
      materialUtils.emitIsValidOnFormInput = jest.fn();

      const value = 'test';

      const result = component['shouldEmitAutocomplete'](value);

      expect(result).toBeTruthy();
      expect(materialUtils.emitIsValidOnFormInput).toHaveBeenCalledWith(
        value,
        component.isValid,
        component.formControl
      );
    });
  });

  describe('isInputValid', () => {
    test('should never emit invalid input events', () => {
      component['extractFormValue'] = jest.fn();
      component['validateFormValue'] = jest.fn(() => false);
      component.unselect = jest.fn();

      const control = {
        value: 'test',
      };

      const result = component['isInputValid'](control as AbstractControl);

      expect(result).toBeUndefined();
      expect(component['extractFormValue']).toHaveBeenCalledWith(control.value);
      expect(component['validateFormValue']).toHaveBeenCalledTimes(1);
      expect(component.unselect).toHaveBeenCalledTimes(1);
    });

    test('should never emit invalid input events and not unselect if valid', () => {
      component['extractFormValue'] = jest.fn();
      component['validateFormValue'] = jest.fn(() => true);
      component.unselect = jest.fn();

      const control = {
        value: 'test',
      };

      const result = component['isInputValid'](control as AbstractControl);

      expect(result).toBeUndefined();
      expect(component['extractFormValue']).toHaveBeenCalledWith(control.value);
      expect(component['validateFormValue']).toHaveBeenCalledTimes(1);
      expect(component.unselect).not.toHaveBeenCalled();
    });
  });

  describe('onOptionsChange', () => {
    beforeEach(() => {
      component.selectedIdValue = undefined;
      component.debounceIsActive = false;
      component.autocompleteOptions = [];
    });

    test('should only set autocompleteOptions when form value matches and selected id value undefined', () => {
      const options = [
        { id: '1', value: 'test value', selected: false },
        { id: '2', value: 'another value', selected: false },
      ];

      component['setFormControlValue'] = jest.fn();
      component.formControl.setValue('test');

      component['onOptionsChange']([], options);

      expect(component.autocompleteOptions).toEqual(options);
      expect(component.selectedIdValue).toBeUndefined();
      expect(component.debounceIsActive).toBeFalsy();
      expect(component['setFormControlValue']).not.toHaveBeenCalled();
    });

    test('should update form control if selected and form matches', () => {
      const options = [
        { id: 'another value 4', value: 'another value 4', selected: false },
        { id: '2', value: 'another value', selected: true },
      ];

      component.formControl.setValue('another value');
      component['setFormControlValue'] = jest.fn();

      component['onOptionsChange']([], options);

      expect(component.autocompleteOptions).toEqual([options[0], options[1]]);
      expect(component.selectedIdValue).toEqual(options[1]);
      expect(component.debounceIsActive).toBeTruthy();
      expect(component['setFormControlValue']).toHaveBeenCalled();
    });

    test('should update form control if selected and form matches and ignore case', () => {
      const options = [
        { id: 'ANOTHER VALUE 4', value: 'ANOTHER VALUE 4', selected: false },
        { id: '2', value: 'ANOTHER VALUE', selected: true },
      ];

      component.formControl.setValue('another value');
      component['setFormControlValue'] = jest.fn();

      component['onOptionsChange']([], options);

      expect(component.autocompleteOptions).toEqual([options[0], options[1]]);
      expect(component.selectedIdValue).toEqual(options[1]);
      expect(component.debounceIsActive).toBeTruthy();
      expect(component['setFormControlValue']).toHaveBeenCalled();
    });

    test('should reset autocompleteOptions when at least one unselected option does not match form value', () => {
      const previousOptions: IdValue[] = [];
      const options = [
        { id: '1', value: 'test value', selected: false },
        { id: '2', value: 'another value', selected: true },
      ];

      component.formControl.setValue('another');
      component['setFormControlValue'] = jest.fn();

      component['onOptionsChange'](previousOptions, options);

      expect(component.autocompleteOptions).toEqual([]);
      expect(component.selectedIdValue).toEqual(options[1]);
      expect(component.debounceIsActive).toBeTruthy();
      expect(component['setFormControlValue']).toHaveBeenCalled();
    });

    test('should show previous autocompleteOptions if a custom form control is set and keep old selectedIdValue', () => {
      const previousOptions: IdValue[] = [];
      const options = [
        {
          id: 'another',
          value: 'test value',
          value2: 'test value 3',
          selected: false,
        },
        {
          id: null,
          value: 'test value',
          value2: 'test value 3',
          selected: false,
        },
        { id: null as any, value: 'another value', selected: false },
      ];

      component.selectedIdValue = {
        id: 'another',
        value: 'test value',
        value2: 'test value 3',
        selected: true,
      };
      component.formControl.setValue('another');
      component['setFormControlValue'] = jest.fn();

      component['onOptionsChange'](previousOptions, options);

      expect(component.autocompleteOptions).toEqual([options[0]]);
      expect(component.selectedIdValue).toEqual({
        id: 'another',
        value: 'test value',
        value2: 'test value 3',
        selected: true,
      });
      expect(component.debounceIsActive).toBeFalsy();
      expect(component['setFormControlValue']).not.toHaveBeenCalled();
    });

    test('should reset autocompleteOptions if a custom form control is set, all unselected options not match and keep old selectedIdValue', () => {
      const options = [
        {
          id: '1',
          value: 'test value',
          value2: 'test value 3',
          selected: false,
        },
        {
          id: null,
          value: 'test value',
          value2: 'test value 3',
          selected: false,
        },
        { id: null as any, value: 'another value', selected: false },
      ];

      component.selectedIdValue = {
        id: 'another',
        value: 'test value',
        value2: 'test value 3',
        selected: true,
      };
      component.formControl.setValue('another');
      component['setFormControlValue'] = jest.fn();

      component['onOptionsChange']([{} as any], options);

      expect(component.autocompleteOptions).toEqual([]);
      expect(component.selectedIdValue).toEqual({
        id: 'another',
        value: 'test value',
        value2: 'test value 3',
        selected: true,
      });
      expect(component.debounceIsActive).toBeFalsy();
      expect(component['setFormControlValue']).not.toHaveBeenCalled();
    });
  });
});
