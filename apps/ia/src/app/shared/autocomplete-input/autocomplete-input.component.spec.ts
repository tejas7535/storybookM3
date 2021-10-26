import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';

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
      ReactiveComponentModule,
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

      component.value = '123';

      expect(component.inputControl.setValue).toHaveBeenCalledWith('123');
    });

    test('should reset control if input undefined', () => {
      component['lastEmittedValue'] = 'last val';

      component.inputControl.setValue = jest.fn();
      component.inputControl.reset = jest.fn();

      component.value = undefined;

      expect(component.inputControl.setValue).not.toHaveBeenCalled();
      expect(component.inputControl.reset).toHaveBeenCalledTimes(1);
    });
  });

  describe('ngOnInit', () => {
    test('should set error state matcher', () => {
      component.ngOnInit();

      expect(component.errorStateMatcher).toBeDefined();
    });

    test('should listen to input changes', () => {
      component['filterOptions'] = jest.fn();

      component.ngOnInit();

      component.filteredOptions.subscribe();

      component.inputControl.setValue('test');

      expect(component['filterOptions']).toHaveBeenCalledWith('test');
    });
  });

  describe('filter', () => {
    test('should filter options that do not include the value', () => {
      const value = 'cherry';

      const filtered = component['filterOptions'](value);

      expect(filtered).toEqual([
        new IdValue('1', 'cherryo'),
        new IdValue('3', 'cherry'),
        new IdValue('4', 'cherrygold'),
      ]);
    });
  });

  describe('validateInput', () => {
    test('should emit false  when input is valid', () => {
      component.filter.options = [{ id: 'Schaeffler', value: 'Schaeffler' }];
      component.invalidFormControl.emit = jest.fn();
      component.validateInput({ target: { value: 'Schaeffler' } });

      expect(component.invalidFormControl.emit).toHaveBeenCalledWith(false);
    });
    test('should emit true  when input is invalid', () => {
      component.filter.options = [{ id: 'Schaeffler', value: 'Schaeffler' }];
      component.invalidFormControl.emit = jest.fn();
      component.validateInput({ target: { value: 'ABC' } });

      expect(component.invalidFormControl.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('optionSelected', () => {
    test('should blur input', () => {
      component['matInput'].nativeElement.blur = jest.fn();

      component.optionSelected({});

      expect(component['matInput'].nativeElement.blur).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    test('should unsubscribe', () => {
      component.subscription.unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    test('should add blur subscription and set error when option is not valid', fakeAsync(() => {
      component.inputControl.setErrors = jest.fn();

      component.ngAfterViewInit();
      component.inputControl.setValue('test');
      const input = spectator.query('input');
      input.dispatchEvent(new Event('blur'));

      tick(250);

      expect(component.inputControl.setErrors).toHaveBeenCalled();
    }));

    test('should add blur subscription and do nothing when value did not change', fakeAsync(() => {
      component.inputControl.setErrors = jest.fn();
      component['lastEmittedValue'] = '3';
      component.selected.emit = jest.fn();

      component.ngAfterViewInit();
      component.inputControl.setValue('3');
      const input = spectator.query('input');
      input.dispatchEvent(new Event('blur'));

      tick(250);

      expect(component.inputControl.setErrors).not.toHaveBeenCalled();
      expect(component.selected.emit).not.toHaveBeenCalled();
    }));

    test('should add blur subscription and emit event when value is valid and changes', fakeAsync(() => {
      component['lastEmittedValue'] = '';
      component.selected.emit = jest.fn();
      component.inputControl.setErrors = jest.fn();

      component.ngAfterViewInit();
      component.inputControl.setValue('3');
      const input = spectator.query('input');
      input.dispatchEvent(new Event('blur'));

      tick(250);

      expect(component.inputControl.setErrors).not.toHaveBeenCalled();
      expect(component.selected.emit).toHaveBeenCalledWith({
        name: 'orgUnit',
        value: '3',
      });
    }));
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const result = component.trackByFn(0);

      expect(result).toEqual(0);
    });
  });
});
