import { MatDividerModule } from '@angular/material/divider';

import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';
import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getUserRoles } from '../core/store/selectors';
import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { FilterKey, SelectedFilter } from '../shared/models';
import { updateUserSettings } from './store/actions/user-settings.action';
import { getUserOrgUnit } from './store/selectors/user-settings.selector';
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
    ],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            user: {
              username: 'Hans',
            },
          },
          filter: {
            orgUnits: {
              loading: false,
              items: [],
              errorMessage: undefined,
            },
            timePeriods: [],
            selectedFilters: {
              ids: [],
              entities: {},
            },
          },
          userSettings: {
            data: {
              orgUnit: 'Sales',
            },
            loading: false,
            errorMessage: undefined,
            dialog: {
              orgUnitsLoading: false,
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
      'should set selectedOrgUnit',
      marbles((m) => {
        const orgUnit = 'Example org';
        store.overrideSelector(getUserOrgUnit, orgUnit);
        const expected = m.cold('a', { a: orgUnit });

        component.ngOnInit();

        m.expect(component.selectedOrgUnit$).toBeObservable(expected);
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

  describe('optionSelected', () => {
    test('should save user`s resort', () => {
      const selectedFilter: SelectedFilter = new SelectedFilter(
        FilterKey.ORG_UNIT,
        {
          id: 'Sales',
          value: 'Sales',
        }
      );
      component.saveOrgUnit = jest.fn();

      component.optionSelected(selectedFilter);

      expect(component.saveOrgUnit).toHaveBeenCalledWith(selectedFilter);
    });
  });

  describe('saveOrgUnit', () => {
    test('should save user`s resort', () => {
      const selectedFilter: SelectedFilter = new SelectedFilter(
        FilterKey.ORG_UNIT,
        {
          id: 'Sales',
          value: 'Sales',
        }
      );

      component.saveOrgUnit(selectedFilter);

      expect(store.dispatch).toHaveBeenCalledWith(
        updateUserSettings({
          data: {
            orgUnitKey: selectedFilter.idValue.id,
            orgUnitDisplayName: selectedFilter.idValue.value,
          },
        })
      );
    });
  });
});
