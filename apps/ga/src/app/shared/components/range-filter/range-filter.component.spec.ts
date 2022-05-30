import { SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoService } from '@ngneat/transloco';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RangeFilterComponent } from './range-filter.component';
import { InputType, RangeFilter } from './range-filter.model';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

const mockedTranslate = jest.fn();

describe('RangeFilterComponent', () => {
  let component: RangeFilterComponent;
  let spectator: Spectator<RangeFilterComponent>;

  const mockUnit = 'xy';

  const createComponent = createComponentFactory({
    component: RangeFilterComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      FormsModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatIconModule,
      MatInputModule,
      MatSelectModule,
      MatSliderModule,
    ],
    declarations: [RangeFilterValuePipe],
    disableAnimations: true,
    detectChanges: false,
    providers: [
      {
        provide: TranslocoService,
        useValue: {
          translate: mockedTranslate,
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    mockedTranslate.mockClear();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    let changes: SimpleChanges;
    let filter: RangeFilter;

    beforeEach(() => {
      filter = {
        name: 'length',
        min: 0,
        max: 100,
        unit: mockUnit,
      };
    });

    it('should reset the form, if minSelected and maxSelected is undefined', () => {
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.reset).toHaveBeenCalled();
    });
  });

  describe('reset', () => {
    it('should reset the form', () => {
      component.form.reset = jest.fn();

      component.reset();

      expect(component.form.reset).toHaveBeenCalled();
    });
  });

  describe('resetInput', () => {
    it('should emit updateFilter in order to reset min|max input', () => {
      const filter: RangeFilter = {
        name: 'name',
        min: 0,
        max: 100,
        minSelected: 20,
        maxSelected: 80,
        unit: mockUnit,
      };

      component['updateFilter'].emit = jest.fn();

      component.rangeFilter = filter;
      component.resetInput(InputType.Max);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        maxSelected: 100,
      });
    });
  });

  describe('update', () => {
    let input: InputType;
    let value: number | string;
    let filter: RangeFilter;

    beforeEach(() => {
      filter = {
        name: 'length',
        min: 0,
        max: 100,
        unit: mockUnit,
      };

      component['updateMinInput'] = jest.fn();
      component['updateMaxInput'] = jest.fn();
      component.resetInput = jest.fn();
    });

    it('should call reset, if value equals min', () => {
      input = InputType.Min;
      value = 0;
      component.rangeFilter = filter;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should call updateMinInput', () => {
      input = InputType.Min;
      // number for input of slider
      value = 20;
      component.rangeFilter = filter;

      component.update(input, value);

      expect(component['updateMinInput']).toHaveBeenCalledWith(20);
    });

    it('should call reset, if value equals max', () => {
      input = InputType.Max;
      value = 100;
      component.rangeFilter = filter;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should call updateMaxInput', () => {
      input = InputType.Max;
      // string for html input
      value = '80';
      component.rangeFilter = filter;

      component.update(input, value);

      expect(component['updateMaxInput']).toHaveBeenCalledWith(80);
    });
  });

  describe('updateMinInput', () => {
    let value: number;
    let filter: RangeFilter;

    beforeEach(() => {
      filter = {
        name: 'length',
        min: 0,
        max: 100,
        unit: mockUnit,
      };

      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value < maxSelected', () => {
      value = 20;
      component.rangeFilter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        minSelected: 20,
        maxSelected: filter.max,
      });
    });

    it('should emit updateFilter with maxSelected increased by one, if value > maxSelected', () => {
      value = 50;
      filter.maxSelected = 40;
      component.rangeFilter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        minSelected: 50,
        maxSelected: 51,
      });
    });

    it('should emit updateFilter with maxSelected = undefined and value = value -1, if value equals max', () => {
      value = 100;
      filter.maxSelected = 40;
      component.rangeFilter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        minSelected: 99,
        maxSelected: 100,
      });
    });
  });

  describe('updateMaxInput', () => {
    let value: number;
    let filter: RangeFilter;

    beforeEach(() => {
      filter = {
        name: 'length',
        min: 0,
        max: 100,
        unit: mockUnit,
      };

      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value > minSelected', () => {
      value = 80;
      component.rangeFilter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        maxSelected: 80,
        minSelected: filter.min,
      });
    });

    it('should emit updateFilter with minSelected decreased by one, if value < minSelected', () => {
      value = 40;
      filter.minSelected = 50;
      component.rangeFilter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        minSelected: 39,
        maxSelected: 40,
      });
    });

    it('should emit updateFilter with minSelected = undefined and value = value +1, if value equals min', () => {
      value = 0;
      filter.minSelected = 40;
      component.rangeFilter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        minSelected: 0,
        maxSelected: 1,
      });
    });
  });

  describe('formatSliderThumbLabel', () => {
    it('should return values below 1000 unformatted as string', () => {
      expect(component.formatSliderThumbLabel(992.39)).toBe('992.39');
      expect(component.formatSliderThumbLabel(0.82)).toBe('0.82');
      expect(component.formatSliderThumbLabel(5.82)).toBe('5.82');
      expect(component.formatSliderThumbLabel(900)).toBe('900');
    });

    it('should abbreviate thousands with K and no digits', () => {
      expect(component.formatSliderThumbLabel(123_456)).toBe('123K');
      expect(component.formatSliderThumbLabel(123_556)).toBe('124K');
      expect(component.formatSliderThumbLabel(900_001)).toBe('900K');
    });

    it('should abbreviate millions to M with one digit', () => {
      expect(component.formatSliderThumbLabel(1_234_569)).toBe('1.2M');
      expect(component.formatSliderThumbLabel(1_254_569)).toBe('1.3M');
      expect(component.formatSliderThumbLabel(9_000_001)).toBe('9.0M');
    });
  });
});
