import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map, Observable, Subscription } from 'rxjs';

import { TranslocoService } from '@ngneat/transloco';
import { Store } from '@ngrx/store';

import { getSpecificDimensonFilter } from '../../../core/store/selectors/filter/filter.selector';
import { AutocompleteInputComponent } from '../../../shared/autocomplete-input/autocomplete-input.component';
import {
  ASYNC_SEARCH_MIN_CHAR_LENGTH,
  FILTER_DIMENSIONS,
  LOCAL_SEARCH_MIN_CHAR_LENGTH,
} from '../../../shared/constants';
import {
  Filter,
  FilterDimension,
  IdValue,
  SelectedFilter,
} from '../../../shared/models';
import {
  loadUserSettingsDimensionData,
  updateUserSettings,
} from '../../store/actions/user.action';
import { getDialogSelectedDimensionDataLoading } from '../../store/selectors/user.selector';
import { UserSettings } from '../models/user-settings.model';
import { UserSettingsDialogData } from './user-settings-dialog-data.model';

@Component({
  selector: 'ia-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styles: [],
})
export class UserSettingsDialogComponent implements OnInit, OnDestroy {
  @ViewChild(AutocompleteInputComponent)
  autocompleteInput: AutocompleteInputComponent;

  selected: SelectedFilter;
  invalidDimensionDataInput: boolean;

  activeDimension: FilterDimension;
  dimensionFilter$: Observable<Filter>;
  selectedDimensionIdValue: IdValue;
  selectedDimensionDataLoading$: Observable<boolean>;
  availableDimensions: IdValue[];
  dimensionName: string;

  minCharLength = 0;

  readonly subscription: Subscription = new Subscription();

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: UserSettingsDialogData,
    private readonly store: Store,
    private readonly translocoService: TranslocoService
  ) {
    this.updateDimension(this.data.dimension);
    this.selectedDimensionIdValue = this.data.selectedDimensionIdValue;
  }

  ngOnInit(): void {
    this.selectedDimensionDataLoading$ = this.store.select(
      getDialogSelectedDimensionDataLoading
    );

    this.subscription.add(
      this.translocoService
        .selectTranslateObject('filters.dimension.availableDimensions')
        .pipe(
          map((translateObject) =>
            this.mapTranslationsToIdValues(translateObject)
          )
        )
        .subscribe((dimensions) => {
          this.availableDimensions = dimensions;
          this.updateDimensionName();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  updateDimension(dimension: FilterDimension): void {
    this.dimensionFilter$ = this.store.select(
      getSpecificDimensonFilter(dimension)
    );

    this.activeDimension = dimension;
    this.updateDimensionName();
    this.minCharLength =
      dimension === FilterDimension.ORG_UNIT
        ? ASYNC_SEARCH_MIN_CHAR_LENGTH
        : LOCAL_SEARCH_MIN_CHAR_LENGTH;

    this.selectedDimensionIdValue = undefined;
  }

  updateDimensionName(): void {
    this.dimensionName = this.availableDimensions?.find(
      (dim) => dim.id === this.activeDimension
    )?.value;
  }

  selectDimensionDataOption(option: SelectedFilter): void {
    this.selected = option;
    this.selectedDimensionIdValue = option.idValue;
  }

  invalidDimensionData(invalid: boolean): void {
    this.invalidDimensionDataInput = invalid;
  }

  saveUserSettings(): void {
    const data: Partial<UserSettings> = {
      dimension: this.activeDimension,
      dimensionKey: this.selected.idValue.id,
      dimensionDisplayName: this.selected.idValue.value,
    };
    this.store.dispatch(updateUserSettings({ data }));
  }

  autoCompleteSelectedDimensionIdValueChange(searchFor: string): void {
    if (this.activeDimension === FilterDimension.ORG_UNIT) {
      this.store.dispatch(
        loadUserSettingsDimensionData({
          filterDimension: this.activeDimension,
          searchFor,
        })
      );
    } else {
      this.dimensionFilter$ = this.store
        .select(getSpecificDimensonFilter(this.activeDimension))
        .pipe(
          // eslint-disable-next-line ngrx/avoid-mapping-selectors
          map((filter: Filter) => {
            const options =
              searchFor.length > 0
                ? filter.options.filter((option) =>
                    option.value
                      ?.toUpperCase()
                      .startsWith(searchFor.toUpperCase())
                  )
                : filter.options;

            return { ...filter, options };
          })
        );
    }
  }

  selectDimension(selectedDimension: IdValue): void {
    this.store.dispatch(
      loadUserSettingsDimensionData({
        filterDimension: selectedDimension.id as FilterDimension,
        searchFor: '',
      })
    );
    this.updateDimension(selectedDimension.id as FilterDimension);
    if (this.autocompleteInput) {
      this.autocompleteInput.latestSelection = undefined;
    }
  }

  mapTranslationsToIdValues(
    translations: Record<FilterDimension, string>
  ): IdValue[] {
    return FILTER_DIMENSIONS.map(
      (dimensionLevel) =>
        new IdValue(
          dimensionLevel.dimension,
          translations[dimensionLevel.dimension],
          dimensionLevel.level
        )
    );
  }
}
