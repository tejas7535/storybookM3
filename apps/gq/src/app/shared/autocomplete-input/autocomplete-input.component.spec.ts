import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import * as rxjs from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { IdValue, SapQuotation } from '../../core/store/models';
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
      provideTranslocoTestingModule({}),
    ],
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

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test';
      component.searchFormControl.setValue(testVal);

      expect(component['autocomplete'].emit).toHaveBeenCalledTimes(0);
    });
    test('should add valueChanges subscription directly bc of empty searchform', () => {
      component.options = [new IdValue('1', 'test', false)];

      component['autocomplete'].emit = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      component.searchFormControl.setValue('');

      expect(component['autocomplete'].emit).toHaveBeenCalledTimes(0);
    });
    test('should add valueChanges subscription after DEBOUNCE_TIME_DEFAULT on searchRemote with >1 chars', (done) => {
      component.options = [new IdValue('1', 'test', false)];
      component.filterName = FilterNames.QUOTATION;
      component['autocomplete'].emit = jest.fn();

      const spy = jest.spyOn(rxjs, 'timer');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test1';
      component.searchFormControl.setValue(testVal);

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(component['DEBOUNCE_TIME_DEFAULT']);
        expect(component['autocomplete'].emit).toHaveBeenCalledWith({
          filter: FilterNames.QUOTATION,
          searchFor: testVal,
        });
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });
  });
  describe('set options', () => {
    test('should set test options', () => {
      const options = [
        new IdValue('1', 'test', true),
        new IdValue('2', 'test2', false),
      ];
      component.setFormControlValue = jest.fn();
      component.valueInput = ({
        nativeElement: { value: 'test' },
      } as unknown) as any;
      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.setFormControlValue).toHaveBeenCalledTimes(1);
    });

    test('should set test options when filter name is customer', () => {
      const options = [
        new IdValue('1', 'test', true),
        new IdValue('2', 'test2', false),
      ];
      component.filterName = FilterNames.CUSTOMER;
      component.setFormControlValue = jest.fn();
      component.valueInput = ({
        nativeElement: { value: 'test | 1' },
      } as unknown) as any;
      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.setFormControlValue).toHaveBeenCalledTimes(1);
    });

    test('should set test options with SapQuotation', () => {
      const options = [
        new SapQuotation(
          '1',
          'test',
          true,
          false,
          'customerId',
          'customerName',
          {
            id: 'id',
            name: 'name',
          }
        ),
        new SapQuotation(
          '2',
          'test',
          false,
          false,
          'customerId',
          'customerName',
          {
            id: 'id',
            name: 'name',
          }
        ),
      ];
      component.setFormControlValue = jest.fn();
      component.valueInput = ({
        nativeElement: { value: 'customerName | 1' },
      } as unknown) as any;
      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.setFormControlValue).toHaveBeenCalledTimes(1);
    });
  });
  describe('setFormControlValue', () => {
    test('should set value', () => {
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
      expect(
        component.searchFormControl.setValue
      ).toHaveBeenCalledWith(transformresult, { emitEvent: false });
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
  });
  describe('sliceMaterialString', () => {
    test('should slice material string', () => {
      const value = '000001562-6063-1111';
      expect(component.sliceMaterialString(value)).toEqual('000001562-6063-11');
    });
  });

  describe('onPaste', () => {
    test('should set input value', () => {
      component.filterName = FilterNames.MATERIAL;
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
  describe('set isDisabled', () => {
    test('should set test options', () => {
      component.isDisabled = true;
      expect(component.searchFormControl.disabled).toBeTruthy();
      expect(component.searchFormControl.enabled).toBeFalsy();
    });

    test('should set test options', () => {
      component.isDisabled = false;
      expect(component.searchFormControl.disabled).toBeFalsy();
      expect(component.searchFormControl.enabled).toBeTruthy();
    });
  });

  describe('selected', () => {
    test('should emit event', () => {
      component.added.emit = jest.fn();

      component.selected(({
        option: { value: 'value' },
      } as unknown) as MatAutocompleteSelectedEvent);
      expect(component.added.emit).toHaveBeenCalledTimes(1);
    });
  });
  describe('clearInput', () => {
    test('should call unselect', () => {
      component.unselect = jest.fn();
      component.valueInput = ({
        nativeElement: { value: 'test' },
      } as unknown) as any;
      component.searchFormControl = ({
        setValue: jest.fn(),
      } as unknown) as any;
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

  describe('isSapQuotation()', () => {
    test('should return true', () => {
      const retValue = component.isSapQuotation(
        new SapQuotation(
          '1',
          'test',
          true,
          false,
          'customerId',
          'customerName',
          {
            id: 'id',
            name: 'name',
          }
        )
      );
      expect(retValue).toBeTruthy();
    });

    test('should return false', () => {
      const retValue = component.isSapQuotation(new IdValue('1', 'test', true));
      expect(retValue).toBeFalsy();
    });
  });
});
