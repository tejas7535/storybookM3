import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { RolesGroup } from '@schaeffler/roles-and-rights';

import { getOrgUnitsFilter, getUserRoles } from '../core/store/selectors';
import { Filter, SelectedFilter } from '../shared/models';
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
    const data = { orgUnit: option.idValue.id };
    this.store.dispatch(updateUserSettings({ data }));
  }

  autoCompleteOrgUnitsChange(searchFor: string): void {
    this.store.dispatch(loadUserSettingsOrgUnits({ searchFor }));
  }
}
