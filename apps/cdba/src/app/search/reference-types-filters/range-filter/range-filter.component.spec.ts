import { SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { TranslocoService } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { DEFAULT_RESULTS_THRESHOLD } from '@cdba/shared/constants/reference-type';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { InputType } from './input-type.enum';
import { RangeFilterComponent } from './range-filter.component';
import { RangeFilterValuePipe } from './range-filter-value.pipe';

const mockedTranslate = jest.fn();

describe('RangeFilterComponent', () => {
  let component: RangeFilterComponent;
  let spectator: Spectator<RangeFilterComponent>;

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
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
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

  describe('ngOnInit', () => {
    let filter: FilterItemRange;
    let setupDefaultRangeValuesSpy: jest.SpyInstance;

    beforeEach(() => {
      filter = new FilterItemRange(
        'budget_quantity',
        0,
        100,
        10,
        90,
        'pc',
        false
      );

      setupDefaultRangeValuesSpy = jest.spyOn(
        component as any,
        'setupDefaultRangeValues'
      );
    });

    it('should set default range values', () => {
      const budgetFilter = filter;
      component.filter = budgetFilter;

      component.ngOnInit();

      expect(setupDefaultRangeValuesSpy).toHaveBeenCalledTimes(1);

      expect(component.minSectionMin).toEqual(0);
      expect(component.minSectionMax).toEqual(100);

      expect(component.maxSectionMin).toEqual(0);
      expect(component.maxSectionMax).toEqual(100);

      expect(component.minSectionValue).toEqual(10);
      expect(component.maxSectionValue).toEqual(90);
    });

    it('should select the tooltip translation for the disabled budget_quantity range filter', () => {
      const budgetFilter = filter;
      component.filter = budgetFilter;

      component.ngOnInit();

      expect(mockedTranslate).toHaveBeenCalledWith(
        'search.referenceTypesFilters.tooltips.disabledBudgetQuantity'
      );
    });

    it('should select the tooltip translation for the disabled dimension range filters', () => {
      const dimensionsFilter = {
        ...filter,
        name: 'width',
        unit: 'mm',
      } as FilterItemRange;

      component.filter = dimensionsFilter;
      component.ngOnInit();

      expect(setupDefaultRangeValuesSpy).toHaveBeenCalled();
      expect(mockedTranslate).toHaveBeenCalledWith(
        'search.referenceTypesFilters.tooltips.disabledDimensionFilter'
      );
    });

    it('should set values for limit filter and enable label', () => {
      const limitFilter = {
        ...filter,
        name: 'limit',
        min: undefined,
        minSelected: undefined,
      } as FilterItemRange;
      component.form.setValue = jest.fn();

      component.filter = limitFilter;
      component.ngOnInit();

      expect(component.filter).toEqual(limitFilter);

      expect(component.maxSectionValue).toEqual(DEFAULT_RESULTS_THRESHOLD);
      expect(component.maxSectionMin).toEqual(DEFAULT_RESULTS_THRESHOLD);
      expect(component.maxSectionMax).toEqual(limitFilter.max);

      expect(setupDefaultRangeValuesSpy).toHaveBeenCalledTimes(0);

      expect(component.form.setValue).toHaveBeenCalledWith('showRangeLabel');
    });
  });

  describe('ngOnChanges', () => {
    let changes: SimpleChanges;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange(
        'name',
        0,
        100,
        undefined,
        undefined,
        'xy',
        false
      );
    });

    it('should reset the form, if minSelected and maxSelected is undefined', () => {
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.reset).toHaveBeenCalled();
    });

    it('should set the value showRangeLabel within the form, if minSelected is defined', () => {
      filter.minSelected = 10;
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.value).toEqual('showRangeLabel');
    });

    it('should set the value showRangeLabel within the form, if maxSelected is defined', () => {
      filter.maxSelected = 90;
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.value).toEqual('showRangeLabel');
    });
  });

  describe('reset', () => {
    beforeEach(() => {
      component.form.reset = jest.fn();
    });

    it('should reset the form', () => {
      component.filter = { name: 'name' } as unknown as FilterItemRange;

      component.reset();

      expect(component.form.reset).toHaveBeenCalledTimes(1);
    });
    it('should not reset the form for Limit filter', () => {
      component.filter = { name: 'limit' } as unknown as FilterItemRange;

      component.reset();

      expect(component.form.reset).toHaveBeenCalledTimes(0);
    });
  });

  describe('resetInput', () => {
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100, 20, 80, 'xy', true);
      component['updateFilter'].emit = jest.fn();
    });

    it('should emit limit filter after resetting the input', () => {
      const input: InputType = InputType.Max;

      filter = {
        ...filter,
        name: 'limit',
        min: undefined,
        minSelected: undefined,
      };

      component.filter = filter;
      component.resetInput(input);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        maxSelected: DEFAULT_RESULTS_THRESHOLD,
      } as FilterItemRange);
    });
    it('should emit filter after resetting min input', () => {
      const input: InputType = InputType.Min;

      component.filter = filter;
      component.resetInput(input);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        minSelected: 0,
      });
    });
    it('should emit filter after resetting max input', () => {
      const input: InputType = InputType.Max;

      component.filter = filter;
      component.resetInput(input);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        maxSelected: 100,
      } as FilterItemRange);
    });
  });

  describe('update', () => {
    let input: InputType;
    let value: number | string;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange(
        'name',
        0,
        100,
        undefined,
        undefined,
        'xy',
        false
      );

      component['updateMinInput'] = jest.fn();
      component['updateMaxInput'] = jest.fn();

      component.resetInput = jest.fn();
    });

    it('should call reset for limit filter when value is below the threshold', () => {
      input = InputType.Max;
      value = DEFAULT_RESULTS_THRESHOLD - 10;
      component.filter = { ...filter, name: 'limit' } as FilterItemRange;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should call reset for limit filter if value is above the filters max', () => {
      input = InputType.Max;
      value = 2 * DEFAULT_RESULTS_THRESHOLD;
      component.filter = { ...filter, name: 'limit' } as FilterItemRange;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should validate limit filter when value is correct', () => {
      input = InputType.Max;
      value = 700;
      const limitFilter = {
        ...filter,
        name: 'limit',
        max: 1000,
      } as FilterItemRange;
      component.filter = limitFilter;
      const updateFilterSpy = jest.spyOn(component['updateFilter'], 'emit');

      component.update(input, value);

      expect(updateFilterSpy).toHaveBeenCalledWith({
        ...limitFilter,
        maxSelected: value,
      } as FilterItemRange);
    });

    it('should call reset, if value equals min', () => {
      input = InputType.Min;
      value = 0;
      component.filter = filter;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should call updateMinInput when value is valid', () => {
      input = InputType.Min;
      // number for input of slider
      value = 20;
      component.filter = filter;

      component.update(input, value);

      expect(component['updateMinInput']).toHaveBeenCalledWith(20);
    });

    it('should call reset, if value equals max', () => {
      input = InputType.Max;
      value = 100;
      component.filter = filter;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should call updateMaxInput when value is valid', () => {
      input = InputType.Max;
      // string for html input
      value = '80';
      component.filter = filter;

      component.update(input, value);

      expect(component['updateMaxInput']).toHaveBeenCalledWith(80);
    });
  });

  describe('updateMinInput', () => {
    let value: number;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange(
        'name',
        0,
        100,
        undefined,
        undefined,
        'xy',
        false
      );
      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value < maxSelected', () => {
      value = 20;
      component.filter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        minSelected: 20,
        maxSelected: filter.max,
      } as FilterItemRange);
    });

    it('should emit updateFilter with maxSelected increased by one, if value > maxSelected', () => {
      value = 50;
      filter.maxSelected = 40;
      component.filter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        minSelected: 50,
        maxSelected: 51,
      } as FilterItemRange);
    });

    it('should emit updateFilter with maxSelected = undefined and value = value -1, if value equals max', () => {
      value = 100;
      filter.maxSelected = 40;
      component.filter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        minSelected: 99,
        maxSelected: 100,
      } as FilterItemRange);
    });
  });

  describe('updateMaxInput', () => {
    let value: number;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange(
        'name',
        0,
        100,
        undefined,
        undefined,
        'xy',
        false
      );
      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value > minSelected', () => {
      value = 80;
      component.filter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        maxSelected: 80,
        minSelected: filter.min,
      } as FilterItemRange);
    });

    it('should emit updateFilter with minSelected decreased by one, if value < minSelected', () => {
      value = 40;
      filter.minSelected = 50;
      component.filter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        minSelected: 39,
        maxSelected: 40,
      } as FilterItemRange);
    });

    it('should emit updateFilter with minSelected = undefined and value = value +1, if value equals min', () => {
      value = 0;
      filter.minSelected = 40;
      component.filter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toBeCalledWith({
        ...filter,
        minSelected: 0,
        maxSelected: 1,
      } as FilterItemRange);
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
