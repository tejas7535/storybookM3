import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';

import { AutocompleteInputComponent } from '../autocomplete-input/autocomplete-input.component';
import { InputType } from '../autocomplete-input/models';
import {
  ASYNC_SEARCH_MIN_CHAR_LENGTH,
  LOCAL_SEARCH_MIN_CHAR_LENGTH,
} from '../constants';
import { FilterLayout } from '../filter/filter-layout.enum';
import { Filter, FilterDimension, IdValue, SelectedFilter } from '../models';
import { SelectInputComponent } from '../select-input/select-input.component';
import { DimensionFilterTranslation } from './models';

@Component({
  selector: 'ia-dimension-filter',
  templateUrl: './dimension-filter.component.html',
})
export class DimensionFilterComponent {
  private _availableDimensions: IdValue[];
  private _activeDimension: FilterDimension;
  private _dimensionFilter: Filter;

  filterLayout = FilterLayout;
  type: InputType;
  dimensionName: string;
  options: IdValue[];
  asyncMode = false;
  showCode = false;
  minCharLength = 0;

  @ViewChild(AutocompleteInputComponent)
  autocompleteInputComponent: AutocompleteInputComponent;

  @ViewChild('selectInput')
  selectInput: SelectInputComponent;

  @Input() apparence: 'fill' | 'outline' = 'fill';
  @Input() orgUnitsLoading: boolean;
  @Input() dimensionDataLoading: boolean;
  @Input() disableFilters: boolean;
  @Input() selectedDimensionIdValue: IdValue;
  @Input() layout: FilterLayout = FilterLayout.DEFAULT;
  @Input() dimensionFilterTranslation: DimensionFilterTranslation;

  @Input() set availableDimensions(availableDimensions: IdValue[]) {
    this._availableDimensions = availableDimensions;
    this.dimensionName = this.getDimensionName();
  }

  get availableDimensions(): IdValue[] {
    return this._availableDimensions;
  }

  @Input() set activeDimension(activeDimension: FilterDimension) {
    this._activeDimension = activeDimension;
    this.dimensionName = this.getDimensionName();

    this.showCode = activeDimension !== FilterDimension.ORG_UNIT;

    if (this.autocompleteInputComponent) {
      this.autocompleteInputComponent.latestSelection = undefined;
    }
    this.type =
      activeDimension === FilterDimension.ORG_UNIT
        ? new InputType('autocomplete', this.dimensionName)
        : new InputType('select', this.dimensionName);
  }

  get activeDimension(): FilterDimension {
    return this._activeDimension;
  }

  @Input() set dimensionFilter(dimensionFilter: Filter) {
    this._dimensionFilter = dimensionFilter;
    this.options = dimensionFilter?.options;
    this.minCharLength =
      dimensionFilter?.name === FilterDimension.ORG_UNIT
        ? ASYNC_SEARCH_MIN_CHAR_LENGTH
        : LOCAL_SEARCH_MIN_CHAR_LENGTH;
    this.asyncMode = dimensionFilter?.name === FilterDimension.ORG_UNIT;
  }

  get dimensionFilter(): Filter {
    return this._dimensionFilter;
  }

  @Output() dimensionSelected = new EventEmitter<IdValue>();
  @Output() optionSelected = new EventEmitter<SelectedFilter>();
  @Output() selectedDimensionInvalid = new EventEmitter<void>();
  @Output() readonly autocompleteInput: EventEmitter<string> =
    new EventEmitter();

  onDimensionSelected(selectedDimension: IdValue): void {
    this.dimensionSelected.emit(selectedDimension);
    this.closePanel();
  }

  onOptionSelected(selectedFilter: SelectedFilter): void {
    this.optionSelected.emit(selectedFilter);
    this.closePanel();
  }

  onSelectedDimensionDataInvalid(_invalid: boolean): void {
    this.selectedDimensionInvalid.emit();
  }

  onAutoCompleteInputChange(searchFor: string): void {
    if (this.asyncMode) {
      this.autocompleteInput.emit(searchFor);
    } else {
      this.dimensionFilter.options =
        searchFor.length > 0
          ? this.options?.filter((option) => {
              const searchForUpperCase = searchFor.toUpperCase();

              return (
                option.value?.toUpperCase().includes(searchForUpperCase) ||
                option.id?.toUpperCase().includes(searchForUpperCase)
              );
            })
          : this.options;
    }
  }

  closePanel() {
    this.selectInput.closePanel();
    this.autocompleteInputComponent.focus();
  }

  getDimensionName(): string {
    return this.availableDimensions?.find(
      (dimension) => dimension.id === this.activeDimension
    )?.value;
  }
}
