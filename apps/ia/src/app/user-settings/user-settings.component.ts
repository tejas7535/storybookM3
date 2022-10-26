import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs';

import { Store } from '@ngrx/store';

import { RolesGroup } from '@schaeffler/roles-and-rights';

import { getUserRoles } from '../core/store/selectors';
import { showUserSettingsDialog } from './store/actions/user-settings.action';
import { getFavoriteDimensionDisplayName } from './store/selectors/user-settings.selector';

@Component({
  selector: 'ia-user-settings',
  templateUrl: './user-settings.component.html',
})
export class UserSettingsComponent implements OnInit {
  roleGroups$: Observable<RolesGroup[]>;
  favoriteDimension$: Observable<string>;

  constructor(private readonly store: Store) {}

  ngOnInit(): void {
    this.favoriteDimension$ = this.store.select(
      getFavoriteDimensionDisplayName
    );
    this.roleGroups$ = this.store.select(getUserRoles);
  }

  editUserSettings(): void {
    this.store.dispatch(showUserSettingsDialog());
  }
}
