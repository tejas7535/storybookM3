import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { map, Observable, Subscription } from 'rxjs';

import { TranslocoService } from '@jsverse/transloco';
import { Store } from '@ngrx/store';

import { getSpecificDimensonFilter } from '../../../core/store/selectors/filter/filter.selector';
import { DimensionFilterTranslation } from '../../../shared/dimension-filter/models';
import {
  Filter,
  FilterDimension,
  IdValue,
  SelectedFilter,
} from '../../../shared/models';
import { getAllowedFilterDimensions } from '../../../shared/utils/utilities';
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
export class UserSettingsDialogComponent implements OnInit {
  selected: SelectedFilter;
  invalidDimensionDataInput: boolean;
  activeDimension: FilterDimension;
  selectedDimensionIdValue: IdValue;

  dimensionFilter$: Observable<Filter>;
  selectedDimensionDataLoading$: Observable<boolean>;
  availableDimensions$: Observable<IdValue[]>;
  dimensionFilterTranslation$: Observable<DimensionFilterTranslation>;

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
    this.dimensionFilterTranslation$ =
      this.translocoService.selectTranslateObject('filters.dimension');

    this.availableDimensions$ = this.translocoService
      .selectTranslateObject('filters.dimension.availableDimensions')
      .pipe(
        map((translateObject) =>
          this.mapTranslationsToIdValues(translateObject)
        )
      );
  }

  updateDimension(dimension: FilterDimension): void {
    this.dimensionFilter$ = this.store.select(
      getSpecificDimensonFilter(dimension)
    );

    this.activeDimension = dimension;
    this.selectedDimensionIdValue = undefined;
    this.selected = undefined;
  }

  onDimensionOptionSelected(option: SelectedFilter): void {
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

  onDimensionAutocompleteInput(searchFor: string): void {
    this.store.dispatch(
      loadUserSettingsDimensionData({
        filterDimension: this.activeDimension,
        searchFor,
      })
    );
  }

  onDimensionSelected(selectedDimension: IdValue): void {
    this.store.dispatch(
      loadUserSettingsDimensionData({
        filterDimension: selectedDimension.id as FilterDimension,
        searchFor: '',
      })
    );
    this.updateDimension(selectedDimension.id as FilterDimension);
  }

  mapTranslationsToIdValues(
    translations: Record<FilterDimension, string>
  ): IdValue[] {
    const filterDimensions = getAllowedFilterDimensions();

    return filterDimensions.map(
      (dimensionLevel) =>
        new IdValue(
          dimensionLevel.dimension,
          translations[dimensionLevel.dimension],
          dimensionLevel.level
        )
    );
  }
}
