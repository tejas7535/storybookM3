import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { SelectedFilter } from '../../shared/models';
import { updateUserSettings } from '../store/actions/user-settings.action';
import { UserSettingsDialogComponent } from './user-settings-dialog.component';

describe('UserSettingsDialogComponent', () => {
  let component: UserSettingsDialogComponent;
  let spectator: Spectator<UserSettingsDialogComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UserSettingsDialogComponent,
    detectChanges: false,
    imports: [
      AutocompleteInputModule,
      MatDialogModule,
      MatButtonModule,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [provideMockStore()],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('optionSelected', () => {
    test('should set option', () => {
      const option = new SelectedFilter('test', {
        id: 'Sales',
        value: 'Sales',
      });

      component.optionSelected(option);

      expect(component.selected).toEqual(option);
    });
  });

  describe('orgUnitInvalid', () => {
    test('should set orgUnitInvalid according input', () => {
      component.orgUnitInvalid(true);

      expect(component.invalidOrgUnitInput).toBeTruthy();
    });
  });

  describe('updateUserSettings', () => {
    test('should dispatch updateUserSettings actions', () => {
      const option = new SelectedFilter('test', {
        id: 'Sales',
        value: 'Sales',
      });
      component.selected = option;

      component.updateUserSettings();

      expect(store.dispatch).toHaveBeenCalledWith(
        updateUserSettings({
          data: {
            orgUnitKey: option.idValue.id,
            orgUnitDisplayName: option.idValue.value,
          },
        })
      );
    });
  });
});
