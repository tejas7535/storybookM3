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
  invalidResortInput: boolean;
  resorts: Filter = {
    name: FilterKey.RESORT,
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

  resortInvalid(invalid: boolean): void {
    this.invalidResortInput = invalid;
  }

  updateUserSettings(): void {
    const data = { resort: this.selected.value as string };
    this.store.dispatch(updateUserSettings({ data }));
  }
}
