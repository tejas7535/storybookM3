import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { DimensionFilterTranslation } from '../dimension-filter/models';
import {
  Filter,
  FilterDimension,
  FilterKey,
  IdValue,
  SelectedFilter,
  TimePeriod,
} from '../models';
import { getBeautifiedTimeRange, getTimeRangeHint } from '../utils/utilities';
import { FilterLayout } from './filter-layout.enum';

@Component({
  selector: 'ia-filter',
  templateUrl: './filter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FilterComponent {
  private _selectedDimensionIdValue: IdValue;
  private _selectedTimePeriod: TimePeriod;

  disabledTimeRangeFilter = true;
  filterLayout = FilterLayout;
  timeRangeHintValue = 'time range';

  @Input() showBenchmarkFilter = false;

  @Input() availableDimensions: IdValue[];
  @Input() orgUnitsLoading: boolean;
  @Input() disableFilters: boolean;
  @Input() layout: FilterLayout = FilterLayout.DEFAULT;
  @Input() selectedTime: IdValue;
  @Input() timePeriods: IdValue[];

  @Input() dimensionFilter: Filter;
  @Input() activeDimension: FilterDimension;

  @Input() set selectedDimensionIdValue(selectedDimensionIdValue: IdValue) {
    this._selectedDimensionIdValue = selectedDimensionIdValue;
    this.disabledTimeRangeFilter = selectedDimensionIdValue === undefined;
  }

  get selectedDimensionIdValue(): IdValue {
    return this._selectedDimensionIdValue;
  }

  @Input() dimensionFilterTranslation: DimensionFilterTranslation;
  @Input() dimensionDataLoading: boolean;

  @Input() set selectedTimePeriod(selectedTimePeriod: TimePeriod) {
    this._selectedTimePeriod = selectedTimePeriod;
    this.timeRangeHintValue = getTimeRangeHint(selectedTimePeriod);
  }
  get selectedTimePeriod(): TimePeriod {
    return this._selectedTimePeriod;
  }

  @Input() benchmarkDimensionFilter: Filter;
  @Input() activeBenchmarkDimension: FilterDimension;
  @Input() benchmarkDimensionIdValue: IdValue;
  @Input() benchmarkDimensionFilterTranslation: DimensionFilterTranslation;
  @Input() benchmarkDimensionDataLoading: boolean;

  @Output() selectTimePeriod = new EventEmitter<TimePeriod>();
  @Output() selectTimeRange = new EventEmitter<SelectedFilter>();
  @Output() selectedDimensionInvalid = new EventEmitter<void>();

  @Output() selectDimension = new EventEmitter<IdValue>();
  @Output() selectDimensionOption = new EventEmitter<SelectedFilter>();
  @Output() readonly autoCompleteInput: EventEmitter<string> =
    new EventEmitter();

  @Output() selectBenchmarkDimension = new EventEmitter<IdValue>();
  @Output() selectBenchmarkOption = new EventEmitter<SelectedFilter>();
  @Output() readonly benchmarkAutocompleteInput: EventEmitter<string> =
    new EventEmitter();

  onDimensionSelected(selectedDimension: IdValue): void {
    if (selectedDimension.id !== this.activeDimension) {
      this.selectDimension.emit(selectedDimension);
    }
  }

  onDimensionOptionSelected(selectedFilter: SelectedFilter): void {
    if (selectedFilter.name !== FilterKey.TIME_RANGE) {
      this.selectDimensionOption.emit(selectedFilter);
    }
  }

  onDimensionAutocompleteInput(value: string): void {
    this.autoCompleteInput.emit(value);
  }

  onBenchmarkDimensionSelected(selectedDimension: IdValue): void {
    if (selectedDimension.id !== this.activeBenchmarkDimension) {
      this.selectBenchmarkDimension.emit(selectedDimension);
    }
  }

  onBenchmarkOptionSelected(option: SelectedFilter): void {
    if (option.name !== FilterKey.TIME_RANGE) {
      this.selectBenchmarkOption.emit(option);
    }
  }

  onBenchmarkAutocompleteInput(value: string): void {
    this.benchmarkAutocompleteInput.emit(value);
  }

  timePeriodSelected(idValue: IdValue): void {
    this.selectTimePeriod.emit(idValue.id as TimePeriod);
  }

  timeRangeSelected(timeRange: string): void {
    const filter = {
      name: FilterKey.TIME_RANGE,
      idValue: {
        id: timeRange,
        value: getBeautifiedTimeRange(timeRange),
      },
    };
    this.selectDimensionOption.emit(filter);
    this.selectBenchmarkOption.emit(filter);
  }
}
