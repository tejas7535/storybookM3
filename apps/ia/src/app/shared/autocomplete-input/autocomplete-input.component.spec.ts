import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { FilterKey } from '../../shared/models';
import { Filter, IdValue } from '../models';
import { AutocompleteInputComponent } from './autocomplete-input.component';
import { InputValidatorDirective } from './validation/input-validator.directive';

describe('AutocompleteInputComponent', () => {
  let component: AutocompleteInputComponent;
  let spectator: Spectator<AutocompleteInputComponent>;
  let options: IdValue[];

  const createComponent = createComponentFactory({
    component: AutocompleteInputComponent,
    declarations: [InputValidatorDirective],
    imports: [
      MatAutocompleteModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatProgressSpinnerModule,
    ],
    providers: [{ provide: MATERIAL_SANITY_CHECKS, useValue: false }],
  });

  beforeEach(() => {
    options = [
      new IdValue('1', 'cherryo'),
      new IdValue('2', 'test'),
      new IdValue('3', 'cherry'),
      new IdValue('4', 'cherrygold'),
    ];
    spectator = createComponent({
      props: {
        filter: new Filter(FilterKey.ORG_UNIT, options),
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('set value', () => {
    test('should set value of input', () => {
      component.inputControl.setValue = jest.fn();
      component.filter = new Filter(FilterKey.ORG_UNIT, [
        { id: '123', value: '123' },
      ]);
      component.value = '123';

      expect(component.inputControl.setValue).toHaveBeenCalledWith(
        {
          id: '123',
          value: '123',
        },
        { emitEvent: false }
      );
    });

    test('should create id/value pair if value is of type string', () => {
      component.inputControl.setValue = jest.fn();

      component.value = '123';

      expect(component.inputControl.setValue).toHaveBeenCalledWith(
        { id: '123', value: '123' },
        {
          emitEvent: false,
        }
      );
    });

    test('should reset control if input undefined', () => {
      component.inputControl.setValue = jest.fn();
      component.inputControl.reset = jest.fn();

      component.value = undefined;

      expect(component.inputControl.setValue).not.toHaveBeenCalled();
      expect(component.inputControl.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnInit', () => {
    test('should listen to typing input changes', (done) => {
      component['autoComplete'].emit = jest.fn();
      component['invalidFormControl'].emit = jest.fn();
      component.ngOnInit();

      component.inputControl.setValue('1234');

      setTimeout(() => {
        expect(component['autoComplete'].emit).toHaveBeenCalledWith('1234');
        expect(component['invalidFormControl'].emit).toHaveBeenCalledWith(
          component.inputControl.hasError('invalidInput')
        );
        done();
      }, component['DEBOUNCE_TIME_DEFAULT']);
    });

    test('should listen to selected input changes', () => {
      component['selected'].emit = jest.fn();
      component['invalidFormControl'].emit = jest.fn();
      component.ngOnInit();

      const val = {
        id: '123',
        value: '123',
      };
      component.filter = new Filter(FilterKey.ORG_UNIT, [
        { id: '123', value: '123' },
      ]);

      component.inputControl.setValue(val);

      expect(component['selected'].emit).toHaveBeenCalledWith({
        name: component.filter.name,
        idValue: val,
      });
      expect(component['invalidFormControl'].emit).toHaveBeenCalledWith(
        component.inputControl.hasError('invalidInput')
      );
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(0);

      expect(result).toEqual(0);
    });
  });

  describe('displayFn', () => {
    test('should return value', () => {
      const idVal = {
        id: '123',
        value: '123',
      };
      const result = component.displayFn(idVal);

      expect(result).toEqual(idVal.value);
    });
  });
});
