import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { RolesGroup } from '@schaeffler/roles-and-rights';

import { getUserRoles } from '../core/store/selectors';
import { Filter, FilterKey, SelectedFilter } from '../shared/models';
import { updateUserSettings } from './store/actions/user-settings.action';
import { getUserResort } from './store/selectors/user-settings.selector';

@Component({
  selector: 'ia-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  selectedResort$: Observable<string>;
  roleGroups$: Observable<RolesGroup[]>;

  // TODO: put in store as soon as we get real data from backend
  resorts: Filter = {
    name: FilterKey.RESORT,
    options: [
      { id: 'HR', value: 'HR' },
      { id: 'IT', value: 'IT' },
      { id: 'Sales', value: 'Sales' },
    ],
  };

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.selectedResort$ = this.store.select(getUserResort);
    this.roleGroups$ = this.store.select(getUserRoles);
  }

  optionSelected(option: SelectedFilter) {
    this.saveUserResort(option);
  }

  saveUserResort(option: SelectedFilter): void {
    const data = { resort: option.value as string };
    this.store.dispatch(updateUserSettings({ data }));
  }
}
