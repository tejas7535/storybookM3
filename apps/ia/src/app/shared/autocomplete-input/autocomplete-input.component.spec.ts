import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ReactiveComponentModule } from '@ngrx/component';

import { IdValue } from '../models';
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
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    options = [
      new IdValue('1', 'cherryo'),
      new IdValue('2', 'test'),
      new IdValue('3', 'cherry'),
      new IdValue('4', 'cherrygold'),
    ];
    component.filter.options = options;
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

  describe('optionSelected', () => {
    test('should blur input', () => {
      component['matInput'].nativeElement.blur = jest.fn();

      component.optionSelected({});

      expect(component['matInput'].nativeElement.blur).toHaveBeenCalled();
    });
  });

  describe('inputBlur', () => {
    test('should set error when option is not valid', (done) => {
      component.inputBlur({
        target: {
          value: 'test',
        },
      });

      setTimeout(() => {
        expect(component.inputControl.invalid).toBeTruthy();
        done();
      }, 350);
    });

    test('should do nothing when value did not change', (done) => {
      component['lastEmittedValue'] = 'cherry';
      component.selected.emit = jest.fn();
      component.inputControl.setErrors = jest.fn();
      component.inputBlur({
        target: {
          value: 'cherry',
        },
      });

      setTimeout(() => {
        expect(component.inputControl.setErrors).toHaveBeenCalled();
        expect(component.selected.emit).not.toHaveBeenCalled();
        done();
      }, 350);
    });

    test('should emit event when value is valid and changes', (done) => {
      component['lastEmittedValue'] = '';
      component.selected.emit = jest.fn();
      component.inputControl.setErrors = jest.fn();
      component.inputBlur({
        target: {
          value: '3',
        },
      });

      setTimeout(() => {
        expect(component.inputControl.setErrors).not.toHaveBeenCalled();
        expect(component.selected.emit).toHaveBeenCalledWith({
          name: '',
          options: [new IdValue('3', 'cherry')],
        });
        done();
      }, 350);
    });
  });

  describe('trackByFn', () => {
    test('should return index', () => {
      const idValue = new IdValue('001', 'Bam');

      const result = component.trackByFn(0, idValue);

      expect(result).toEqual(0);
    });
  });
});
