import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';

import { ReplaySubject } from 'rxjs';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { TranslocoModule } from '@jsverse/transloco';
import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockComponent } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { AppShellModule } from '@schaeffler/app-shell';
import {
  ApplicationInsightsService,
  COOKIE_GROUPS,
} from '@schaeffler/application-insights';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MaintenanceModule } from '@schaeffler/empty-states';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK, HEALTH_CHECK_STATE_MOCK } from '../testing/mocks';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HealthCheckFacade } from './core/store/health-check/health-check.facade';
import { GlobalSearchBarModule } from './shared/components/global-search-bar/global-search-bar.module';
import { UserSettingsComponent } from './shared/components/user-settings/user-settings.component';
import { UserSettingsService } from './shared/services/rest/user-settings/user-settings.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

const eventSubject = new ReplaySubject<RouterEvent>(1);

const routerMock = {
  navigate: jest.fn(),
  events: eventSubject.asObservable(),
  url: `legal/foo`,
};

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: MockStore;
  let oneTrustService: OneTrustService;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      PushPipe,
      AppShellModule,
      LoadingSpinnerModule,
      MockComponent(UserSettingsComponent),
      MaintenanceModule,
      AppRoutingModule,
      GlobalSearchBarModule,
      OneTrustModule.forRoot({
        cookiesGroups: COOKIE_GROUPS,
        domainScript: 'mockOneTrustId',
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          healthCheck: HEALTH_CHECK_STATE_MOCK,
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
      {
        provide: Router,
        useValue: routerMock,
      },
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: {
            url: [{ path: `/${LegalPath.ImprintPath}` }],
          },
        },
      },
      mockProvider(UserSettingsService, {
        updateUserSettings: jest.fn(),
      }),
      mockProvider(OneTrustService),
      mockProvider(HealthCheckFacade),
      mockProvider(ApplicationInsightsService),
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
    oneTrustService = spectator.inject(OneTrustService);
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('handleBeforeUnload', () => {
    test('should call the method', () => {
      component.handleBeforeUnload();
      expect(
        component['userSettingsService'].updateUserSettingsAsPromise
      ).toHaveBeenCalledTimes(1);
    });
  });
  describe('ngOnInit', () => {
    test('should set observables and dispatch login', () => {
      oneTrustService.translateBanner = jest.fn();
      store.dispatch = jest.fn();
      component.handleCurrentRoute = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.handleCurrentRoute).toHaveBeenCalledTimes(1);
      expect(oneTrustService.translateBanner).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCurrentRoute', () => {
    test(
      'should consider initial routing event - cookie route inactive',
      marbles((m) => {
        component.handleCurrentRoute();

        m.expect(component.isCookieRouteActive$).toBeObservable(
          m.cold('a', { a: false })
        );
      })
    );

    test(
      'should consider initial routing event - cookie route active',
      marbles((m) => {
        routerMock.url = `${LegalRoute}/${LegalPath.CookiePath}`;
        component.handleCurrentRoute();

        m.expect(component.isCookieRouteActive$).toBeObservable(
          m.cold('a', { a: true })
        );
      })
    );
  });
});
