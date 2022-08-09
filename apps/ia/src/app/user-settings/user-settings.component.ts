import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { RolesGroup } from '@schaeffler/roles-and-rights';

import { FilterDimension } from '../core/store/reducers/filter/filter.reducer';
import { getOrgUnitsFilter, getUserRoles } from '../core/store/selectors';
import { Filter, SelectedFilter } from '../shared/models';
import { UserSettings } from './models/user-settings.model';
import {
  loadUserSettingsOrgUnits,
  updateUserSettings,
} from './store/actions/user-settings.action';
import {
  getDialogOrgUnitLoading,
  getUserOrgUnit,
} from './store/selectors/user-settings.selector';

@Component({
  selector: 'ia-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  selectedOrgUnit$: Observable<string>;
  roleGroups$: Observable<RolesGroup[]>;
  orgUnitsFilter$: Observable<Filter>;
  orgUnitsLoading$: Observable<boolean>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedOrgUnit$ = this.store.select(getUserOrgUnit);
    this.roleGroups$ = this.store.select(getUserRoles);
    this.orgUnitsFilter$ = this.store.select(getOrgUnitsFilter);
    this.orgUnitsLoading$ = this.store.select(getDialogOrgUnitLoading);
  }

  optionSelected(option: SelectedFilter) {
    this.saveOrgUnit(option);
  }

  saveOrgUnit(option: SelectedFilter): void {
    const data: Partial<UserSettings> = {
      orgUnitKey: option.idValue.id,
      orgUnitDisplayName: option.idValue.value,
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
