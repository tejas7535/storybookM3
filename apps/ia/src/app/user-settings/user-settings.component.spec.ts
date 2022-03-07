import { MatDividerModule } from '@angular/material/divider';

import { Spectator } from '@ngneat/spectator';
import { createComponentFactory } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { marbles } from 'rxjs-marbles/marbles';

import { RolesAndRightsModule } from '@schaeffler/roles-and-rights';
import { LanguageSelectModule } from '@schaeffler/transloco/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getUserRoles } from '../core/store/selectors';
import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { SelectedFilter } from '../shared/models';
import { updateUserSettings } from './store/actions/user-settings.action';
import { getUserResort } from './store/selectors/user-settings.selector';
import { UserSettingsComponent } from './user-settings.component';

describe('UserSettingsComponent', () => {
  let component: UserSettingsComponent;
  let spectator: Spectator<UserSettingsComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: UserSettingsComponent,
    imports: [
      ReactiveComponentModule,
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
          userSettings: {
            data: {
              resort: 'Sales',
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
      'should set selectedResort',
      marbles((m) => {
        const resort = 'Example Resort';
        store.overrideSelector(getUserResort, resort);
        const expected = m.cold('a', { a: resort });

        component.ngOnInit();

        m.expect(component.selectedResort$).toBeObservable(expected);
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
        'resort',
        'Sales'
      );
      component.saveUserResort = jest.fn();

      component.optionSelected(selectedFilter);

      expect(component.saveUserResort).toHaveBeenCalledWith(selectedFilter);
    });
  });

  describe('saveUserResort', () => {
    test('should save user`s resort', () => {
      const selectedFilter: SelectedFilter = new SelectedFilter(
        'resort',
        'Sales'
      );

      component.saveUserResort(selectedFilter);

      expect(store.dispatch).toHaveBeenCalledWith(
        updateUserSettings({
          data: {
            resort: selectedFilter.value as string,
          },
        })
      );
    });
  });
});
