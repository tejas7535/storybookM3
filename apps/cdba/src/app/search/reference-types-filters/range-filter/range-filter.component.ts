import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormControl } from '@angular/forms';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { InputType } from './input-type.enum';

@Component({
  selector: 'cdba-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent implements OnChanges {
  public form = new FormControl();
  public inputType = InputType;

  @Input() public filter: FilterItemRange;

  @Output() private readonly removeFilter: EventEmitter<
    string
  > = new EventEmitter();

  @Output() private readonly updateFilter: EventEmitter<
    FilterItemRange
  > = new EventEmitter();

  public ngOnChanges(changes: SimpleChanges): void {
    const selected = !!(
      changes.filter.currentValue.minSelected ||
      changes.filter.currentValue.maxSelected
    );

    if (selected) {
      this.form.setValue('selected');
    } else {
      this.form.reset();
    }
  }

  public reset(input: InputType): void {
    const toUpdate = `${input}Selected`;
    const newValue: number = undefined;

    const updatedFilter = { ...this.filter, [toUpdate]: newValue };

    if (
      (updatedFilter.max === updatedFilter.maxSelected ||
        updatedFilter.maxSelected === undefined) &&
      (updatedFilter.min === updatedFilter.minSelected ||
        updatedFilter.minSelected === undefined)
    ) {
      // filter can be removed entirely since it doesn't limit the query
      this.removeFilter.emit(this.filter.name);
    } else {
      this.updateFilter.emit(updatedFilter);
    }
  }

  public update(input: InputType, newValue: number | string): void {
    const value = +newValue;

    if (input === InputType.Min) {
      if (value === this.filter.min) {
        this.reset(input);
      } else {
        this.updateMinInput(value);
      }
    } else {
      if (value === this.filter.max) {
        this.reset(input);
      } else {
        this.updateMaxInput(value);
      }
    }
  }

  private updateMinInput(newValue: number): void {
    let value = newValue;

    // check if new min value > max selected
    if (value >= this.filter.maxSelected) {
      // check if value < max
      if (value < this.filter.max) {
        // define ticks, 1 may be to large for some filters
        this.filter.maxSelected = value + 1;
      } else {
        value = this.filter.max - 1;
        this.filter.maxSelected = this.filter.max;
      }
    }

    this.updateFilter.emit({ ...this.filter, minSelected: value });
  }

  private updateMaxInput(newValue: number): void {
    let value = newValue;

    // check if new max value is smaller than min selected
    if (value <= this.filter.minSelected) {
      // check if value > min
      if (value > this.filter.min) {
        this.filter.minSelected = value - 1;
      } else {
        value += 1;
        this.filter.minSelected = this.filter.min;
      }
    }

    this.updateFilter.emit({ ...this.filter, maxSelected: value });
  }
}
