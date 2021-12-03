import { SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { InputType } from './input-type.enum';
import { RangeFilterValuePipe } from './range-filter-value.pipe';
import { RangeFilterComponent } from './range-filter.component';
import { TranslocoService } from '@ngneat/transloco';

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
    it('should select the tooltip translation for the disabled budget_quantity range filter', () => {
      component.filter = new FilterItemRange(
        'budget_quantity',
        0,
        100,
        undefined,
        undefined,
        'pc'
      );

      component.ngOnInit();

      expect(mockedTranslate).toHaveBeenCalledWith(
        'search.referenceTypesFilters.tooltips.disabledBudgetQuantity'
      );
    });

    it('should select the tooltip  translation for the disabled dimension range filters', () => {
      component.filter = new FilterItemRange(
        'width',
        0,
        100,
        undefined,
        undefined,
        'mm'
      );

      component.ngOnInit();

      expect(mockedTranslate).toHaveBeenCalledWith(
        'search.referenceTypesFilters.tooltips.disabledDimensionFilter'
      );
    });
  });

  describe('ngOnChanges', () => {
    let changes: SimpleChanges;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100, undefined, undefined, 'xy');
    });

    it('should reset the form, if minSelected and maxSelected is undefined', () => {
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.reset).toHaveBeenCalled();
    });

    it('should set the value selected within the form, if minSelected is defined', () => {
      filter.minSelected = 10;
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.value).toEqual('selected');
    });

    it('should set the value selected within the form, if maxSelected is defined', () => {
      filter.maxSelected = 90;
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      component.ngOnChanges(changes);

      expect(component.form.value).toEqual('selected');
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
      const input: InputType = InputType.Max;

      const filter = new FilterItemRange('name', 0, 100, 20, 80, 'xy');

      component['updateFilter'].emit = jest.fn();

      component.filter = filter;
      component.resetInput(input);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        maxSelected: 100,
      });
    });
  });

  describe('update', () => {
    let input: InputType;
    let value: number | string;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100, undefined, undefined, 'xy');

      component['updateMinInput'] = jest.fn();
      component['updateMaxInput'] = jest.fn();
      component.resetInput = jest.fn();
    });

    it('should call reset, if value equals min', () => {
      input = InputType.Min;
      value = 0;
      component.filter = filter;

      component.update(input, value);

      expect(component.resetInput).toHaveBeenCalledWith(input);
    });

    it('should call updateMinInput', () => {
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

    it('should call updateMaxInput', () => {
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
      filter = new FilterItemRange('name', 0, 100, undefined, undefined, 'xy');

      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value < maxSelected', () => {
      value = 20;
      component.filter = filter;

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
      component.filter = filter;

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
      component.filter = filter;

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
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100, undefined, undefined, 'xy');

      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value > minSelected', () => {
      value = 80;
      component.filter = filter;

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
      component.filter = filter;

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
      component.filter = filter;

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
