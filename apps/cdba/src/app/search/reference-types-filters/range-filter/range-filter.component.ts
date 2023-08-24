import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormControl } from '@angular/forms';

import { TranslocoService } from '@ngneat/transloco';
import { NumberFormatOptions } from '@ngneat/transloco-locale/lib/transloco-locale.types';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import { Filter } from '../filter';
import { InputType } from './input-type.enum';

@Component({
  selector: 'cdba-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent implements OnChanges, OnInit, Filter {
  @Input() public filter: FilterItemRange;

  @Output()
  private readonly updateFilter: EventEmitter<FilterItemRange> = new EventEmitter();

  public form = new UntypedFormControl();
  public inputType = InputType;
  public disabledFilterHint: string;

  decimalNumberFormat: NumberFormatOptions = { maximumFractionDigits: 2 };

  public constructor(private readonly translocoService: TranslocoService) {}

  public ngOnInit(): void {
    this.disabledFilterHint =
      this.filter.name === 'budget_quantity'
        ? this.translocoService.translate(
            'search.referenceTypesFilters.tooltips.disabledBudgetQuantity'
          )
        : this.translocoService.translate(
            'search.referenceTypesFilters.tooltips.disabledDimensionFilter'
          );
  }

  public ngOnChanges(changes: SimpleChanges): void {
    const selected = !!(
      changes.filter?.currentValue.minSelected ||
      changes.filter?.currentValue.maxSelected
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

    const updatedFilter = { ...this.filter, [toUpdate]: this.filter[input] };

    this.updateFilter.emit(updatedFilter);
  }

  /**
   * Change listener for min/max slider and manual text input
   */
  public update(input: InputType, newValue: number | string): void {
    const value = Number.parseFloat(newValue.toString().replace(',', '.'));

    if (input === InputType.Min) {
      if (value === this.filter.min) {
        this.resetInput(input);
      } else {
        this.updateMinInput(value);
      }
    } else {
      if (value === this.filter.max) {
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
    let maxSelected = this.filter.maxSelected;

    // no max value yet selected
    if (!maxSelected) {
      maxSelected = this.filter.max;
    }

    // check if new min value > max selected
    if (value >= this.filter.maxSelected) {
      // check if value < max
      if (value < this.filter.max) {
        // define ticks, 1 may be to large for some filters
        maxSelected = maxSelected === 0 ? this.filter.max : value + 1;
      } else {
        value = this.filter.max - 1;
        maxSelected = this.filter.max;
      }
    }

    this.updateFilter.emit({ ...this.filter, maxSelected, minSelected: value });
  }

  /**
   * Update filter selection dependent on new max input.
   */
  private updateMaxInput(newValue: number): void {
    let value = newValue;
    let minSelected = this.filter.minSelected;

    // no min value yet selected
    if (!minSelected) {
      minSelected = this.filter.min;
    }

    // check if new max value is smaller than min selected
    if (value <= this.filter.minSelected) {
      // check if value > min
      if (value > this.filter.min) {
        minSelected = value - 1;
      } else {
        value += 1;
        minSelected = this.filter.min;
      }
    }

    this.updateFilter.emit({ ...this.filter, minSelected, maxSelected: value });
  }
}
