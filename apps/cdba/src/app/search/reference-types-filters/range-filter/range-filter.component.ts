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

import { TranslocoService } from '@jsverse/transloco';
import { NumberFormatOptions } from '@jsverse/transloco-locale/lib/transloco-locale.types';

import { DEFAULT_RESULTS_THRESHOLD } from '@cdba/shared/constants/reference-type';

import { FilterItemRange } from '../../../core/store/reducers/search/models';
import {
  FILTER_NAME_BUDGET_QUANTITY,
  FILTER_NAME_LIMIT,
} from '../../../shared/constants/filter-names';
import { Filter } from '../filter';
import { InputType } from './input-type.enum';

@Component({
  selector: 'cdba-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeFilterComponent implements OnChanges, OnInit, Filter {
  @Input()
  public filter: FilterItemRange;

  @Output()
  private readonly updateFilter: EventEmitter<FilterItemRange> =
    new EventEmitter();

  public form = new UntypedFormControl();
  public inputType = InputType;
  public disabledFilterHint: string;
  public FILTER_NAME_LIMIT = FILTER_NAME_LIMIT;
  public STABLE_THRESHOLD = 700;

  minSectionValue = 0;
  minSectionMin = 0;
  minSectionMax = 0;

  maxSectionValue = 0;
  maxSectionMin = 0;
  maxSectionMax = 0;

  decimalNumberFormat: NumberFormatOptions = { maximumFractionDigits: 2 };

  public constructor(private readonly translocoService: TranslocoService) {}

  public ngOnInit(): void {
    switch (this.filter.name) {
      case FILTER_NAME_LIMIT: {
        this.maxSectionValue = DEFAULT_RESULTS_THRESHOLD;
        this.maxSectionMin = DEFAULT_RESULTS_THRESHOLD;
        this.maxSectionMax = this.filter.max;
        break;
      }
      case FILTER_NAME_BUDGET_QUANTITY: {
        this.disabledFilterHint = this.translocoService.translate(
          'search.referenceTypesFilters.tooltips.disabledBudgetQuantity'
        );
        this.setupDefaultRangeValues();
        break;
      }
      default: {
        this.disabledFilterHint = this.translocoService.translate(
          'search.referenceTypesFilters.tooltips.disabledDimensionFilter'
        );
        this.setupDefaultRangeValues();
        break;
      }
    }

    if (this.filter.name === FILTER_NAME_LIMIT) {
      this.form.setValue('showRangeLabel');
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.minSectionValue = changes.filter?.currentValue.minSelected;
    this.maxSectionValue = changes.filter?.currentValue.maxSelected;

    const showRangeLabel = !!(this.minSectionValue || this.maxSectionValue);

    // mat-select-trigger displays the label only when at least one mat-option is available
    // the value for this option is then ignored and overwritten by the pipe
    if (showRangeLabel) {
      this.form.setValue('showRangeLabel');
    } else {
      this.form.reset();
    }
  }

  /**
   * Reset input and emit update.
   */
  public resetInput(input: InputType): void {
    const toUpdate = `${input}Selected`;

    if (this.filter.name === FILTER_NAME_LIMIT) {
      this.updateFilter.emit({
        ...this.filter,
        maxSelected: DEFAULT_RESULTS_THRESHOLD,
      } as FilterItemRange);
    } else {
      this.updateFilter.emit({
        ...this.filter,
        [toUpdate]: this.filter[input],
      } as FilterItemRange);
    }
  }

  /**
   * Change listener for min/max slider and manual text input
   */
  public update(input: InputType, newValue: number | string): void {
    const value = Number.parseFloat(newValue.toString().replace(',', '.'));

    switch (this.filter.name) {
      case FILTER_NAME_LIMIT: {
        if (value < DEFAULT_RESULTS_THRESHOLD || value > this.filter.max) {
          this.resetInput(input);
        } else {
          this.updateFilter.emit({
            ...this.filter,
            maxSelected: value,
          } as FilterItemRange);
        }
        break;
      }
      default: {
        {
          if (value <= this.filter.min || value >= this.filter.max) {
            this.resetInput(input);
          } else {
            if (input === InputType.Min) {
              this.updateMinInput(value);
            } else {
              this.updateMaxInput(value);
            }
          }
        }
        break;
      }
    }
  }

  public reset(): void {
    // skip form reset for Limit filter as it clears the label
    if (this.filter.name !== FILTER_NAME_LIMIT) {
      this.form.reset();
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

    this.updateFilter.emit({
      ...this.filter,
      minSelected: value,
      maxSelected,
    } as FilterItemRange);
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

    this.updateFilter.emit({
      ...this.filter,
      minSelected,
      maxSelected: value,
    } as FilterItemRange);
  }

  /**
   * Sets default range values for filter. The values are taken from the `filter` object
   */
  private setupDefaultRangeValues(): void {
    this.minSectionValue = this.filter.minSelected;
    this.minSectionMin = this.filter.min;
    this.minSectionMax = this.filter.max;

    this.maxSectionValue = this.filter.maxSelected;
    this.maxSectionMin = this.filter.min;
    this.maxSectionMax = this.filter.max;
  }
}
