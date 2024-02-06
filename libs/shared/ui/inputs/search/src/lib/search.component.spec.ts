import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { StringOption } from '../../../src/lib/models/string-option.model';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let spectator: Spectator<SearchComponent>;

  const mockOptions: StringOption[] = [
    { id: 0, title: 'option0' },
    { id: 1, title: 'option1' },
    { id: 2, title: 'option2' },
    { id: 3, title: 'option3' },
    { id: 4, title: 'option4' },
    { id: 5, title: 'option5' },
    { id: 6, title: 'option6' },
    { id: 7, title: 'option7' },
    { id: 8, title: 'option8' },
    { id: 9, title: 'option9' },
  ];

  const createComponent = createComponentFactory({
    component: SearchComponent,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MockModule(MatAutocompleteModule),
      MockModule(MatFormFieldModule),
      MockModule(MatInputModule),
      MockModule(MatIconModule),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    spectator.setInput({
      stringOptions: mockOptions,
    });
    spectator.detectChanges();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the filterOptions function', () => {
      const mockFn = (_option: StringOption, _value: string) => true;
      component.filterFn = mockFn;

      component.ngOnInit();

      expect(component.filterOptions).toEqual(mockFn);
    });

    it('should set the validators', () => {
      component.searchControl.addValidators = jest.fn();

      component.ngOnInit();

      expect(component.searchControl.addValidators).toHaveBeenCalledWith(
        component['validatorFn']
      );
    });

    it('should emit on change of the formControl', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.optionSelected.emit = jest.fn();
      component.searchControl.updateValueAndValidity = jest.fn();
      jest.useFakeTimers();

      component.control.patchValue(mockOption);

      jest.advanceTimersByTime(1000);

      expect(component.optionSelected.emit).toHaveBeenCalledWith(mockOption);
      expect(component.searchControl.updateValueAndValidity).toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should emit on change of the searchControl', () => {
      component.searchUpdated.emit = jest.fn();
      jest.useFakeTimers();

      component.searchControl.patchValue('test');

      jest.advanceTimersByTime(1000);

      expect(component.searchUpdated.emit).toHaveBeenCalledWith('test');
      jest.useRealTimers();
    });

    it('should not emit if value is not a string', () => {
      component.searchUpdated.emit = jest.fn();
      jest.useFakeTimers();

      component.searchControl.patchValue({ a: 't' });

      jest.advanceTimersByTime(1000);

      expect(component.searchUpdated.emit).not.toHaveBeenCalled();
      jest.useRealTimers();
    });

    it('should emit empty string on change of the searchControl if length is under threshold', () => {
      component.searchUpdated.emit = jest.fn();
      jest.useFakeTimers();

      component.searchControl.patchValue('t');

      jest.advanceTimersByTime(1000);

      expect(component.searchUpdated.emit).toHaveBeenCalledWith('');
      jest.useRealTimers();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component['subscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(component['subscription'].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessorFunctions', () => {
    const mockFn = () => {};
    const mockOption = { id: 'mockId', title: 'mockTitle' };
    it('should set value through writeValue', () => {
      component.writeValue(mockOption);
      expect(component.control.value).toEqual(mockOption);
    });

    it('should register supplied fn as onTouched method', () => {
      component.registerOnTouched(mockFn);
      expect(component['onTouched']).toEqual(mockFn);
    });

    it('should add a subscription during onChange fn registration', () => {
      component['subscription'].add = jest.fn();
      component.registerOnChange(mockFn);
      expect(component['subscription'].add).toHaveBeenCalled();
    });

    it('should do a number of things through setValue', () => {
      component['onChange'] = jest.fn();
      component['onTouched'] = jest.fn();

      component.writeValue(mockOption);
      expect(component.control.value).toEqual(mockOption);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
      expect(component.onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('onOptionSelected', () => {
    it('should set the value of the formControl', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.control.setValue = jest.fn();

      component.onOptionSelected(mockOption);

      expect(component.control.setValue).toHaveBeenCalledWith(mockOption);
    });
  });

  describe('onSearchReset', () => {
    it('should set the value of the searchControl to an empty string and reset the formControl', () => {
      component.searchControl.setValue = jest.fn();
      component.control.reset = jest.fn();

      component.onSearchReset();

      expect(component.searchControl.setValue).toHaveBeenCalledWith('');
      expect(component.stringOptions).toBe(undefined);
      expect(component.control.reset).toHaveBeenCalled();
    });
  });

  describe('get filteredOptions', () => {
    it('should return undefined if options are not defined', () => {
      component.stringOptions = undefined;

      expect(component.filteredOptions).toBe(undefined);
    });

    it('should call filterOptions', () => {
      const mockOptionYes = {
        id: 'yes',
        title: 'yes',
      };
      const mockOptionNo = {
        id: 'no',
        title: 'no',
      };
      component.searchControl.setValue('', { emitEvent: false });
      component.stringOptions = [mockOptionYes, mockOptionNo];
      component.filterOptions = jest.fn((option) =>
        option.title === 'no' ? false : true
      );

      const result = component.filteredOptions;

      expect(result).toEqual([
        {
          id: 'yes',
          title: 'yes',
        },
      ]);
      expect(component.filterOptions).toHaveBeenCalledWith(mockOptionYes, '');
      expect(component.filterOptions).toHaveBeenCalledWith(mockOptionNo, '');
    });
  });

  describe('get formControlRequired', () => {
    it('should check for the validator and return true', () => {
      component.control = new FormControl('', [Validators.required]);

      const result = component.formControlRequired;

      expect(result).toBe(true);
    });

    it('should check for the validator and return false', () => {
      component.control = new FormControl('');

      const result = component.formControlRequired;

      expect(result).toBe(false);
    });
  });

  describe('displayWithFn', () => {
    it('should return the title of the option', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.displayWith = 'title';

      const result = component.displayWithFn(mockOption);

      expect(result).toBe('mockTitle');
    });

    it('should return the id of the option', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.displayWith = 'id';

      const result = component.displayWithFn(mockOption);

      expect(result).toBe('mockId');
    });
  });

  describe('filterOptions', () => {
    it('should return true', () => {
      const result = component.filterOptions();

      expect(result).toBe(true);
    });
  });

  describe('trackByFn', () => {
    it('should return the index', () => {
      const result = component.trackByFn(5);

      expect(result).toEqual(5);
    });
  });

  describe('validatorFn', () => {
    it('should return the controls errors', () => {
      component.control = {
        errors: { test: true },
      } as unknown as FormControl;

      const result = component['validatorFn']({} as FormControl);

      expect(result).toEqual({ test: true });
    });
  });
});
