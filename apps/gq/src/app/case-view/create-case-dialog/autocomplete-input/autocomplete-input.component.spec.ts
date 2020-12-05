import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import * as rxjs from 'rxjs';

import { IdValue, SapQuotation } from '../../../core/store/models';
import { AutocompleteInputComponent } from './autocomplete-input.component';
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
      component.filterName = 'quotation';
      component['autocomplete'].emit = jest.fn();

      const spy = jest.spyOn(rxjs, 'timer');

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      const testVal = 'test1';
      component.searchFormControl.setValue(testVal);

      setTimeout(() => {
        expect(spy).toHaveBeenCalledWith(component['DEBOUNCE_TIME_DEFAULT']);
        expect(component['autocomplete'].emit).toHaveBeenCalledWith({
          filter: 'quotation',
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
      component.autofilled = true;
      component.valueInput = ({
        nativeElement: { value: 'test' },
      } as unknown) as any;
      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.autofilled).toBeFalsy();
    });

    test('should set test options when filter name is customer', () => {
      const options = [
        new IdValue('1', 'test', true),
        new IdValue('2', 'test2', false),
      ];
      component.filterName = 'customer';
      component.autofilled = true;
      component.valueInput = ({
        nativeElement: { value: 'test | 1' },
      } as unknown) as any;
      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.autofilled).toBeFalsy();
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
      component.autofilled = true;
      component.valueInput = ({
        nativeElement: { value: 'customerName | 1' },
      } as unknown) as any;
      component.options = options;

      expect(component.selectedIdValue).toEqual(options[0]);
      expect(component.unselectedOptions).toEqual([options[1]]);
      expect(component.autofilled).toBeFalsy();
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
      component.autofilled = false;

      component.selected(({
        option: { value: 'value' },
      } as unknown) as MatAutocompleteSelectedEvent);
      expect(component.added.emit).toHaveBeenCalledTimes(1);
      expect(component.autofilled).toBeTruthy();
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
