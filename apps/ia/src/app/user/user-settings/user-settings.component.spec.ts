import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';
import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getUserRoles } from '../../core/store/selectors';
import { AutocompleteInputModule } from '../../shared/autocomplete-input/autocomplete-input.module';
import { FilterDimension } from '../../shared/models';
import { showUserSettingsDialog } from '../store/actions/user.action';
import { getFavoriteDimensionDisplayName } from '../store/selectors/user.selector';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      PushModule,
      LanguageSelectModule,
      AutocompleteInputModule,
      provideTranslocoTestingModule({ en: {} }),
      MatDividerModule,
      RolesAndRightsModule,
      MatIconModule,
      MatInputModule,
      MatTooltipModule,
      MatDialogModule,
    ],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            user: {
              userId: 'Hans',
            },
          },
          filter: {
            data: {
              orgUnits: {
                loading: false,
                items: [],
                errorMessage: undefined,
              },
            },
            timePeriods: [],
            selectedFilters: {
              ids: [],
              entities: {},
            },
            selectedDimension: FilterDimension.ORG_UNIT,
          },
          user: {
            settings: {
              data: {
                orgUnit: 'Sales',
              },
              loading: false,
              errorMessage: undefined,
              dialog: {
                orgUnitsLoading: false,
              },
            },
          },
          'azure-auth': {},
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test(
      'should set favoriteDimension',
      marbles((m) => {
        const dim = 'Example org';
        store.overrideSelector(getFavoriteDimensionDisplayName, dim);
        const expected = m.cold('a', { a: dim });

        component.ngOnInit();

        m.expect(component.favoriteDimension$).toBeObservable(expected);
      })
    );

    test(
      'should set roleGroups',
      marbles((m) => {
        const userRoles = [
          {
            title: 'Roles',
            roles: [
              {
                title: 'IA Admin',
                rights: 'Admin User',
              },
            ],
          },
        ];
        store.overrideSelector(getUserRoles, userRoles);
        const expected = m.cold('a', { a: userRoles });

        component.ngOnInit();

        m.expect(component.roleGroups$).toBeObservable(expected);
      })
    );
  });

  describe('editUserSettings', () => {
    test('should dispatch action', () => {
      store.dispatch = jest.fn();

      component.editUserSettings();

      expect(store.dispatch).toHaveBeenCalledWith(showUserSettingsDialog());
    });
  });
});
