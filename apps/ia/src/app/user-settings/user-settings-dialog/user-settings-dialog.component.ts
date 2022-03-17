import { Component } from '@angular/core';

import { Store } from '@ngrx/store';

import { Filter, FilterKey, SelectedFilter } from '../../shared/models';
import { updateUserSettings } from '../store/actions/user-settings.action';

@Component({
  selector: 'ia-user-settings-dialog',
  templateUrl: './user-settings-dialog.component.html',
  styles: [],
})
export class UserSettingsDialogComponent {
  selected: SelectedFilter;
  invalidOrgUnitInput: boolean;
  orgUnit: Filter = {
    name: FilterKey.ORG_UNIT,
    options: [
      { id: 'HR', value: 'HR' },
      { id: 'IT', value: 'IT' },
      { id: 'Sales', value: 'Sales' },
    ],
  };

  constructor(private readonly store: Store) {}

  optionSelected(option: SelectedFilter): void {
    this.selected = option;
  }

  orgUnitInvalid(invalid: boolean): void {
    this.invalidOrgUnitInput = invalid;
  }

  updateUserSettings(): void {
    const data = { orgUnit: this.selected.id };
    this.store.dispatch(updateUserSettings({ data }));
  }
}
