import { SimpleChange, SimpleChanges } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { SharedModule } from '../../../shared/shared.module';
import { InputType } from './input-type.enum';
import { RangeFilterValuePipe } from './range-filter-value.pipe';
import { RangeFilterComponent } from './range-filter.component';

describe('RangeFilterComponent', () => {
  let component: RangeFilterComponent;
  let fixture: ComponentFixture<RangeFilterComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [RangeFilterComponent, RangeFilterValuePipe],
      imports: [
        NoopAnimationsModule,
        SharedModule,
        provideTranslocoTestingModule({}),
        FormsModule,
        MatIconModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatSliderModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeFilterComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    let changes: SimpleChanges;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100);
    });

    it('should reset the form, if minSelected and maxSelected is undefined', () => {
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(changes);

      expect(component.form.reset).toHaveBeenCalled();
    });

    it('should set the value selected within the form, if minSelected is defined', () => {
      filter.minSelected = 10;
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(changes);

      expect(component.form.value).toEqual('selected');
    });

    it('should set the value selected within the form, if maxSelected is defined', () => {
      filter.maxSelected = 90;
      changes = { filter: new SimpleChange(undefined, filter, true) };
      component.form.reset = jest.fn();

      // tslint:disable-next-line: no-lifecycle-call
      component.ngOnChanges(changes);

      expect(component.form.value).toEqual('selected');
    });
  });

  describe('reset', () => {
    const input: InputType = InputType.Max;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100);

      component['removeFilter'].emit = jest.fn();
      component['updateFilter'].emit = jest.fn();
    });

    it('should emit removeFilter when filter doesnt limit the query at all', () => {
      filter.maxSelected = 90;

      component.filter = filter;
      component.reset(input);

      expect(component['removeFilter'].emit).toHaveBeenCalledWith(filter.name);
    });

    it('should emit updateFilter in order to reset min|max input', () => {
      filter.minSelected = 20;
      filter.maxSelected = 80;

      component.filter = filter;
      component.reset(input);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        maxSelected: undefined,
      });
    });
  });

  describe('update', () => {
    let input: InputType;
    let value: number | string;
    let filter: FilterItemRange;

    beforeEach(() => {
      filter = new FilterItemRange('name', 0, 100);

      component['updateMinInput'] = jest.fn();
      component['updateMaxInput'] = jest.fn();
      component.reset = jest.fn();
    });

    it('should call reset, if value equals min', () => {
      input = InputType.Min;
      value = 0;
      component.filter = filter;

      component.update(input, value);

      expect(component.reset).toHaveBeenCalledWith(input);
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

      expect(component.reset).toHaveBeenCalledWith(input);
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
      filter = new FilterItemRange('name', 0, 100);

      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value < maxSelected', () => {
      value = 20;
      component.filter = filter;

      component['updateMinInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        minSelected: 20,
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
      filter = new FilterItemRange('name', 0, 100);

      component['updateFilter'].emit = jest.fn();
    });

    it('should emit updateFilter with new value, if value > minSelected', () => {
      value = 80;
      component.filter = filter;

      component['updateMaxInput'](value);

      expect(component['updateFilter'].emit).toHaveBeenCalledWith({
        ...filter,
        maxSelected: 80,
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
});
