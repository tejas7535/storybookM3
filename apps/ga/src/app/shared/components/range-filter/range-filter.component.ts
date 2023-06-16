import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { InputType, RangeFilter } from './range-filter.model';

@Component({
  selector: 'ga-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent implements OnChanges {
  @Input() public rangeFilter: RangeFilter;

  @Output()
  public updateFilter: EventEmitter<RangeFilter> = new EventEmitter();

  public form = new UntypedFormControl();
  public inputType = InputType;

  public ngOnChanges(changes: SimpleChanges): void {
    const selected = !!(
      changes.rangeFilter?.currentValue.minSelected ||
      changes.rangeFilter?.currentValue.maxSelected
    );

    if (selected) {
      this.form.setValue('selected');
    } else {
      this.form.reset();
    }
  }

  /**
   * Reset form.
   */
  public reset(): void {
    this.form.reset();
  }

  /**
   * Reset input and emit update.
   */
  public resetInput(input: InputType): void {
    const toUpdate = `${input}Selected`;

    const updatedFilter = {
      ...this.rangeFilter,
      [toUpdate]: this.rangeFilter[input],
    };

    this.updateFilter.emit(updatedFilter);
  }

  /**
   * Change listener for min/max slider and manual text input
   */
  public update(input: InputType, newValue: number | string): void {
    const value = Number.parseFloat(newValue.toString().replace(',', '.'));

    if (input === InputType.Min) {
      if (value === this.rangeFilter.min) {
        this.resetInput(input);
      } else {
        this.updateMinInput(value);
      }
    } else {
      if (value === this.rangeFilter.max) {
        this.resetInput(input);
      } else {
        this.updateMaxInput(value);
      }
    }
  }

  public formatSliderThumbLabel(value: number): string {
    if (value > 999 && value < 1_000_000) {
      return `${Math.round(value / 1000)}K`;
    }

    if (value > 1_000_000) {
      return `${(value / 1_000_000).toFixed(1)}M`;
    }

    return String(value);
  }

  /**
   * Update filter selection dependent on new min input.
   */
  private updateMinInput(newValue: number): void {
    let value = newValue;
    let maxSelected = this.rangeFilter.maxSelected;

    // no max value yet selected
    if (!maxSelected) {
      maxSelected = this.rangeFilter.max;
    }

    // check if new min value > max selected
    if (value >= this.rangeFilter.maxSelected) {
      // check if value < max
      if (value < this.rangeFilter.max) {
        // define ticks, 1 may be to large for some filters
        maxSelected = maxSelected === 0 ? this.rangeFilter.max : value + 1;
      } else {
        value = this.rangeFilter.max - 1;
        maxSelected = this.rangeFilter.max;
      }
    }

    this.updateFilter.emit({
      ...this.rangeFilter,
      maxSelected,
      minSelected: value,
    });
  }

  /**
   * Update filter selection dependent on new max input.
   */
  private updateMaxInput(newValue: number): void {
    let value = newValue;
    let minSelected = this.rangeFilter.minSelected;

    // no min value yet selected
    if (!minSelected) {
      minSelected = this.rangeFilter.min;
    }

    // check if new max value is smaller than min selected
    if (value <= this.rangeFilter.minSelected) {
      // check if value > min
      if (value > this.rangeFilter.min) {
        minSelected = value - 1;
      } else {
        value += 1;
        minSelected = this.rangeFilter.min;
      }
    }

    this.updateFilter.emit({
      ...this.rangeFilter,
      minSelected,
      maxSelected: value,
    });
  }
}
