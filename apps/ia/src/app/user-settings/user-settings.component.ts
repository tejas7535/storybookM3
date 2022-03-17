import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { RolesGroup } from '@schaeffler/roles-and-rights';

import { getUserRoles } from '../core/store/selectors';
import { Filter, FilterKey, SelectedFilter } from '../shared/models';
import { updateUserSettings } from './store/actions/user-settings.action';
import { getUserOrgUnit } from './store/selectors/user-settings.selector';

@Component({
  selector: 'ia-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  selectedOrgUnit$: Observable<string>;
  roleGroups$: Observable<RolesGroup[]>;

  // TODO: put in store as soon as we get real data from backend
  orgUnits: Filter = {
    name: FilterKey.ORG_UNIT,
    options: [
      { id: 'HR', value: 'HR' },
      { id: 'IT', value: 'IT' },
      { id: 'Sales', value: 'Sales' },
    ],
  };

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedOrgUnit$ = this.store.select(getUserOrgUnit);
    this.roleGroups$ = this.store.select(getUserRoles);
  }

  optionSelected(option: SelectedFilter) {
    this.saveOrgUnit(option);
  }

  saveOrgUnit(option: SelectedFilter): void {
    const data = { orgUnit: option.id };
    this.store.dispatch(updateUserSettings({ data }));
  }
}
