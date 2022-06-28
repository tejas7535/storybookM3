import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoTestingModule } from '@ngneat/transloco';
import { MockModule } from 'ng-mocks';

import { StringOption } from '@schaeffler/inputs';

import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let spectator: Spectator<SelectComponent>;

  const mockOptions: StringOption[] = [
    {
      id: 0,
      title: 'option0',
      tooltip: 'tooltip',
      tooltipDelay: 1000,
      removable: true,
    },
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
    component: SelectComponent,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      TranslocoTestingModule,
      MockModule(MatFormFieldModule),
      MockModule(MatSelectModule),
      MockModule(MatInputModule),
      MockModule(MatIconModule),
      MockModule(MatCheckboxModule),
      MockModule(MatTooltipModule),
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
    it('should emit on change of the formControl', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.optionSelected.emit = jest.fn();
      jest.useFakeTimers();

      component.formControl.patchValue(mockOption);

      jest.advanceTimersByTime(1000);

      expect(component.optionSelected.emit).toHaveBeenCalledWith(mockOption);
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
      expect(component.formControl.value).toEqual(mockOption);
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
      expect(component.formControl.value).toEqual(mockOption);
      expect(component.onTouched).toHaveBeenCalledTimes(1);
      expect(component.onChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('select', () => {
    it('should emit and select the option', () => {
      const mockMatOption = {
        select: jest.fn(),
      } as unknown as MatOption;

      component.select(mockMatOption);

      expect(mockMatOption.select).toHaveBeenCalled();
    });

    it('should emit and not throw if option is undefined', () => {
      expect(() => component.select()).not.toThrow();
    });
  });

  describe('onSelectAllToggle', () => {
    it('should select all if checked', () => {
      for (const option of component['selectOptions']) {
        option.select = jest.fn();
      }

      component.onSelectAllToggle(true);

      for (const option of component['selectOptions']) {
        expect(option.select).toHaveBeenCalled();
      }
    });

    it('should deselect all if not checked', () => {
      for (const option of component['selectOptions']) {
        option.deselect = jest.fn();
      }

      component.onSelectAllToggle(false);

      for (const option of component['selectOptions']) {
        expect(option.deselect).toHaveBeenCalled();
      }
    });
  });

  describe('onOptionRemoved', () => {
    it('should emit the removed option', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.optionRemoved.emit = jest.fn();

      component.onOptionRemoved(mockOption);

      expect(component.optionRemoved.emit).toHaveBeenCalledWith(mockOption);
    });
  });

  describe('onClickAddEntry', () => {
    it('should set addingEntry true', () => {
      component.addingEntry = false;

      component.onClickAddEntry();

      expect(component.addingEntry).toBe(true);
    });
  });

  describe('onCancelAddEntry', () => {
    it('should set addingEntry false', () => {
      component.addingEntry = true;

      component.onCancelAddEntry();

      expect(component.addingEntry).toBe(false);
    });
  });

  describe('onConfirmAddEntry', () => {
    it('should emit the value and set addingEntry false', () => {
      component.addingEntry = true;
      component.entryAdded.emit = jest.fn();

      component.onConfirmAddEntry('test');

      expect(component.addingEntry).toBe(false);
      expect(component.entryAdded.emit).toHaveBeenCalledWith('test');
    });
  });

  describe('get currentValue', () => {
    it('should return the title of the selected option if single select', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.multiple = false;
      component.formControl.setValue(mockOption);

      const currentValue = component.currentValue;

      expect(currentValue).toBe('mockTitle');
    });

    it('should return undefined if the control value is undefined', () => {
      component.multiple = false;
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.formControl.setValue(undefined);

      const currentValue = component.currentValue;

      expect(currentValue).toBe(undefined);
    });

    it('should return an array of the selected titles if multi select', () => {
      const mockOption = { id: 'mockId', title: 'mockTitle' };
      component.multiple = true;
      component.formControl.setValue([mockOption, mockOption]);

      const currentValue = component.currentValue;

      expect(currentValue).toEqual(['mockTitle', 'mockTitle']);
    });

    it('should return undefined if the control value is undefined in multi select', () => {
      component.multiple = true;
      // eslint-disable-next-line unicorn/no-useless-undefined
      component.formControl.setValue(undefined);

      const currentValue = component.currentValue;

      expect(currentValue).toBe(undefined);
    });
  });

  describe('trackByFn', () => {
    it('should return the index', () => {
      const result = component.trackByFn(5);

      expect(result).toEqual(5);
    });
  });
});
