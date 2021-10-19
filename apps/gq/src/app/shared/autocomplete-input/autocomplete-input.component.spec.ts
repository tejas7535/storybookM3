import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import * as rxjs from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { IdValue } from '../models/search';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { FilterNames } from './filter-names.enum';
import { NoResultsFoundPipe } from './pipes/no-results-found.pipe';

describe('AutocompleteInputComponent', () => {
  let component: AutocompleteInputComponent;
  let spectator: Spectator<AutocompleteInputComponent>;

  const createComponent = createComponentFactory({
    component: AutocompleteInputComponent,
    declarations: [AutocompleteInputComponent, NoResultsFoundPipe],
    imports: [
      MatAutocompleteModule,
      MatChipsModule,
      MatInputModule,
      MatSelectModule,
      MatInputModule,
      ReactiveFormsModule,
      MatProgressSpinnerModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    test('should add valueChanges subscription directly', () => {
      component['autocomplete'].emit = jest.fn();

      component.ngOnInit();

      const testVal = 'test';
      component.searchFormControl.setValue(testVal);

      expect(component['autocomplete'].emit).toHaveBeenCalledTimes(0);
    });
    test('should add valueChanges subscription directly bc of empty searchform', () => {
      component.options = [new IdValue('1', 'test', false)];

      component['autocomplete'].emit = jest.fn();

      component.ngOnInit();

      component.searchFormControl.setValue('');

      expect(component['autocomplete'].emit).toHaveBeenCalledTimes(0);
    });
    test('should add valueChanges subscription after DEBOUNCE_TIME_DEFAULT on searchRemote with >1 chars', (done) => {
      component.options = [new IdValue('1', 'test', false)];
      component.filterName = FilterNames.SAP_QUOTATION;
      component['autocomplete'].emit = jest.fn();
      const spy = jest.spyOn(rxjs, 'timer');
      const testVal = 'test1';

      component.ngOnInit();

      component.searchFormControl.setValue(testVal);

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(component['DEBOUNCE_TIME_DEFAULT']);
        expect(component['autocomplete'].emit).toHaveBeenCalledWith({
          filter: FilterNames.SAP_QUOTATION,
          searchFor: testVal,
        });
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });
  });
  describe('setter options', () => {
    test('should set test options', () => {
      const options = [
        new IdValue('1', 'test', true),
        new IdValue('2', 'test2', false),
      ];
      component.setFormControlValue = jest.fn();
      component.debounceIsActive = false;
      component.valueInput = {
        nativeElement: { value: 'test' },
      } as unknown as any;

      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.setFormControlValue).toHaveBeenCalledTimes(1);
      expect(component.debounceIsActive).toBeTruthy();
    });

    test('should set test options when filter name is customer', () => {
      const options = [
        new IdValue('1', 'test', true),
        new IdValue('2', 'test2', false),
      ];
      component.filterName = FilterNames.CUSTOMER;
      component.setFormControlValue = jest.fn();
      component.valueInput = {
        nativeElement: { value: 'test | 1' },
      } as unknown as any;

      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.setFormControlValue).toHaveBeenCalledTimes(1);
    });

    test('should set test options with SapQuotation', () => {
      const options = [
        new IdValue('1', 'test', true),
        new IdValue('2', 'test2', false),
      ];
      component.setFormControlValue = jest.fn();
      component.valueInput = {
        nativeElement: { value: 'customerName | 1' },
      } as unknown as any;

      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.setFormControlValue).toHaveBeenCalledTimes(1);
    });

    test('should clear unselectedOptions, if filterName equals MATERIAL_NUMBER', () => {
      component.valueInput = {
        nativeElement: { value: '009003843000001' },
      } as any;
      component.filterName = FilterNames.MATERIAL_NUMBER;

      component.options = [
        new IdValue('F-234517.DKLFA#E', '009003843000001', false),
      ];

      expect(component.unselectedOptions.length).toBe(0);
    });
  });
  describe('setFormControlValue', () => {
    test('should set value for Customer', () => {
      component.selectedIdValue = {
        id: '1',
        value: '2',
      } as any;
      component.filterName = FilterNames.CUSTOMER;
      const transformresult = `1 | 2`;
      component.transformFormValue = jest.fn(() => transformresult);
      component.searchFormControl = {
        setValue: jest.fn(),
        hasError: jest.fn(),
      } as any;
      component.isValid.emit = jest.fn();
      component.inputContent.emit = jest.fn();
      component.setFormControlValue();

      expect(component.searchFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.searchFormControl.setValue).toHaveBeenCalledWith(
        transformresult,
        { emitEvent: false }
      );
      expect(component.isValid.emit).toHaveBeenCalledTimes(1);
      expect(component.inputContent.emit).toHaveBeenCalledTimes(1);
    });
    test('should set value for material', () => {
      component.selectedIdValue = {
        id: 'f-a123',
        value: '2123',
      } as any;
      const transformresult = `f-a123`;
      component.filterName = FilterNames.MATERIAL_NUMBER;
      component.transformFormValue = jest.fn(() => transformresult);
      component.searchFormControl = {
        setValue: jest.fn(),
        hasError: jest.fn(),
      } as any;
      component.isValid.emit = jest.fn();
      component.inputContent.emit = jest.fn();
      component.setFormControlValue();

      expect(component.searchFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.searchFormControl.setValue).toHaveBeenCalledWith(
        transformresult,
        { emitEvent: false }
      );
      expect(component.isValid.emit).toHaveBeenCalledTimes(1);
      expect(component.inputContent.emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('transformFormValue', () => {
    test('should return string with dash', () => {
      const id = '13';
      const value = '45';

      const result = component.transformFormValue(id, value);

      expect(result).toEqual(`${id} | ${value}`);
    });
    test('should return only id', () => {
      // eslint-disable-next-line unicorn/no-useless-undefined
      const result = component.transformFormValue('1', undefined);
      expect(result).toEqual('1');
    });
  });
  describe('sliceMaterialString', () => {
    test('should slice material string', () => {
      const value = '000001562-6063-1111';
      expect(component.sliceMaterialString(value)).toEqual('000001562-6063-11');
    });
  });

  describe('onPaste', () => {
    test('should set input value', () => {
      component.filterName = FilterNames.MATERIAL_NUMBER;
      const string = '000001562-6063-1111';
      const expectedString = '000001562-6063-11';
      const event = {
        preventDefault: jest.fn(),
        clipboardData: {
          getData: jest.fn(() => string),
        },
      } as any;
      component.formatMaterialNumber = jest.fn(() => string);
      component.searchFormControl.setValue = jest.fn();
      component.sliceMaterialString = jest.fn(() => expectedString);

      component.onPaste(event);
      expect(event.preventDefault).toHaveBeenCalledTimes(1);
      expect(component.formatMaterialNumber).toHaveBeenCalledTimes(1);
      expect(component.formatMaterialNumber).toHaveBeenCalledWith(string);
      expect(event.clipboardData.getData).toHaveBeenCalledTimes(1);
      expect(component.searchFormControl.setValue).toHaveBeenCalledTimes(1);
      expect(component.searchFormControl.setValue).toHaveBeenLastCalledWith(
        expectedString
      );
      expect(component.sliceMaterialString).toHaveBeenCalledWith(string);
    });
  });

  describe('formatMaterialNumber', () => {
    test('should return formated material', () => {
      const materialNumberInput = '001682873000002';
      const expectedResult = '001682873-0000-02';
      const result = component.formatMaterialNumber(materialNumberInput);

      expect(result).toEqual(expectedResult);
    });
  });
  describe('set isDisabled', () => {
    test('should set test options for isDisabled true', () => {
      component.isDisabled = true;
      expect(component.searchFormControl.disabled).toBeTruthy();
      expect(component.searchFormControl.enabled).toBeFalsy();
    });

    test('should set test options for isDisabled false', () => {
      component.isDisabled = false;
      expect(component.searchFormControl.disabled).toBeFalsy();
      expect(component.searchFormControl.enabled).toBeTruthy();
    });
  });

  describe('selected', () => {
    test('should emit event', () => {
      component.added.emit = jest.fn();

      component.selected({
        option: { value: 'value' },
      } as unknown as MatAutocompleteSelectedEvent);
      expect(component.added.emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('clearInput', () => {
    test('should call unselect', () => {
      component.unselect = jest.fn();
      component.valueInput = {
        nativeElement: { value: 'test' },
      } as unknown as any;
      component.searchFormControl = {
        setValue: jest.fn(),
      } as unknown as any;
      component.clearInput();
      expect(component.unselect).toHaveBeenCalledTimes(1);
      expect(component.valueInput.nativeElement.value).toEqual('');
      expect(component.searchFormControl.setValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('trackByFn()', () => {
    test('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
  describe('resetInputField', () => {
    test('should reset inputField content', () => {
      component.searchFormControl.setValue = jest.fn();
      component.resetInputField();

      expect(component.searchFormControl.setValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('isInputValid', () => {
    test('should return valid', () => {
      component.selectedIdValue = { id: '1' } as any;
      const result = component.isInputValid({ value: '1 | 2' } as any);

      expect(result).toEqual({ invalidInput: true });
    });
  });
});
