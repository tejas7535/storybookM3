import { ActivatedRoute } from '@angular/router';

import { of } from 'rxjs';

import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';

import { AppComponent } from './app.component';
import { AppRoutePath } from './app.routes.enum';
import { AlertService } from './feature/alerts/alert.service';
import { CurrencyService } from './feature/info/currency.service';
import { GlobalSelectionStateService } from './shared/components/global-selection-criteria/global-selection-state.service';
import { UserSettingsComponent } from './shared/components/user-settings/user-settings.component';
import { UserService } from './shared/services/user.service';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [MockComponent(UserSettingsComponent)],
    providers: [
      mockProvider(AlertService),
      mockProvider(GlobalSelectionStateService),
      mockProvider(MsalService, {
        handleRedirectObservable: () => of(),
        instance: {
          enableAccountStorageEvents: () => '',
        },
      }),
      mockProvider(MsalBroadcastService, {
        msalSubject$: of(),
        inProgress$: of(),
      }),
      provideMockStore({
        initialState: {
          'azure-auth': {
            accountInfo: undefined,
            profileImage: { url: undefined },
          },
        },
      }),
      mockProvider(ActivatedRoute, { queryParams: of() }),
      mockProvider(CurrencyService),
      mockProvider(UserService, {
        loadRegion: () => of(),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });

  it('should show the plain title when a general route is active', () => {
    spectator.component['activeUrl'].set(AppRoutePath.TodoPage);
    expect(spectator.component['title']()).toBe('header.fullTitle');
  });

  it('should show demandSuite in title when a route from the demand suite is active', () => {
    spectator.component['activeUrl'].set(AppRoutePath.DemandValidationPage);
    expect(spectator.component['title']()).toBe(
      'header.fullTitle | tabbarMenu.demandSuite'
    );
  });

  it('should show salesSuite in title when a route from the sales suite is active', () => {
    spectator.component['activeUrl'].set(AppRoutePath.SalesValidationPage);
    expect(spectator.component['title']()).toBe(
      'header.fullTitle | tabbarMenu.salesSuite'
    );
  });
});
