import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { FilterDimension } from '../../core/store/reducers/filter/filter.reducer';
import { getOrgUnitsFilter } from '../../core/store/selectors/filter/filter.selector';
import { Filter, SelectedFilter } from '../../shared/models';
import { UserSettings } from '../models/user-settings.model';
import {
  loadUserSettingsOrgUnits,
  updateUserSettings,
} from '../store/actions/user-settings.action';
import { getDialogOrgUnitLoading } from '../store/selectors/user-settings.selector';

@Component({
  selector: 'ia-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styles: [],
})
export class UserSettingsDialogComponent implements OnInit {
  selected: SelectedFilter;
  invalidOrgUnitInput: boolean;

  orgUnitsFilter$: Observable<Filter>;
  orgUnitsLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.orgUnitsFilter$ = this.store.select(getOrgUnitsFilter);
    this.orgUnitsLoading$ = this.store.select(getDialogOrgUnitLoading);
  }

  optionSelected(option: SelectedFilter): void {
    this.selected = option;
  }

  orgUnitInvalid(invalid: boolean): void {
    this.invalidOrgUnitInput = invalid;
  }

  updateUserSettings(): void {
    const data: Partial<UserSettings> = {
      orgUnitKey: this.selected.idValue.id,
      orgUnitDisplayName: this.selected.idValue.value,
    };
    this.store.dispatch(updateUserSettings({ data }));
  }

  autoCompleteOrgUnitsChange(searchFor: string): void {
    this.store.dispatch(
      loadUserSettingsOrgUnits({
        filterDimension: FilterDimension.ORG_UNITS,
        searchFor,
      })
    );
  }
}
