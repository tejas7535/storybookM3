import { fakeAsync, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
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
    declarations: [AutocompleteInputComponent, InputValidatorDirective],
    imports: [
      MatAutocompleteModule,
      MatInputModule,
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      ReactiveComponentModule,
    ],
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
        filter: new Filter(FilterKey.COUNTRY, options),
      },
    });
    component = spectator.debugElement.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set error state matcher', () => {
      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnInit();

      expect(component.errorStateMatcher).toBeDefined();
    });

    test('should listen to input changes', () => {
      component['filterOptions'] = jest.fn();
      // tslint:disable-next-line: no-lifecycle-call
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

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnDestroy();

      expect(component.subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngAfterViewInit', () => {
    test('should add blur subscription and set error when option is not valid', fakeAsync(() => {
      component.inputControl.setErrors = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.inputControl.setValue('test');
      spectator.blur(component['matInput']);

      tick(250);

      expect(component.inputControl.setErrors).toHaveBeenCalled();
    }));

    test('should add blur subscription and do nothing when value did not change', fakeAsync(() => {
      component.inputControl.setErrors = jest.fn();
      component['lastEmittedValue'] = '3';
      component.selected.emit = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.inputControl.setValue('3');
      spectator.blur(component['matInput']);

      tick(250);

      expect(component.inputControl.setErrors).not.toHaveBeenCalled();
      expect(component.selected.emit).not.toHaveBeenCalled();
    }));

    test('should add blur subscription and emit event when value is valid and changes', fakeAsync(() => {
      component['lastEmittedValue'] = '';
      component.selected.emit = jest.fn();
      component.inputControl.setErrors = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngAfterViewInit();
      component.inputControl.setValue('3');
      spectator.blur(component['matInput']);

      tick(250);

      expect(component.inputControl.setErrors).not.toHaveBeenCalled();
      expect(component.selected.emit).toHaveBeenCalledWith({
        name: 'country',
        value: '3',
      });
    }));
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idValue = new IdValue('001', 'Bam');

      const result = component.trackByFn(0, idValue);

      expect(result).toEqual(0);
    });
  });
});
