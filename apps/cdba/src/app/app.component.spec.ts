import { MatDividerModule } from '@angular/material/divider';
import { RouterTestingModule } from '@angular/router/testing';

import {
  BetaFeatureModule,
  BrowserSupportModule,
  LoadingSpinnerModule,
  RoleDescriptionsModule,
  UserSettingsModule,
} from '@cdba/shared/components';
import { ROLES_STATE_SUCCESS_MOCK } from '@cdba/testing/mocks';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';

import { AppShellModule } from '@schaeffler/app-shell';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      RouterTestingModule,
      ReactiveComponentModule,
      MockModule(MatDividerModule),
      MockModule(AppShellModule),
      MockModule(BetaFeatureModule),
      MockModule(BrowserSupportModule),
      MockModule(LoadingSpinnerModule),
      MockModule(RoleDescriptionsModule),
      MockModule(UserSettingsModule),
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': {
            accountInfo: {
              name: 'Jefferson',
            },
            profileImage: {
              url: 'img',
            },
          },
          roles: ROLES_STATE_SUCCESS_MOCK,
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

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  test(`should have as title 'Cost Database Analytics'`, () => {
    expect(component.title).toEqual('Cost Database Analytics');
  });

  test('should set observables', () => {
    expect(component.isLoggedIn$).toBeDefined();
    expect(component.username$).toBeDefined();
    expect(component.profileImage$).toBeDefined();
  });
});
