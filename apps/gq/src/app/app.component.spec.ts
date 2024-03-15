import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';

import { ReplaySubject } from 'rxjs';

import { OneTrustModule, OneTrustService } from '@altack/ngx-onetrust';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { TranslocoModule } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { MockModule } from 'ng-mocks';
import { marbles } from 'rxjs-marbles';

import { AppShellModule } from '@schaeffler/app-shell';
import { COOKIE_GROUPS } from '@schaeffler/application-insights';
import { MaintenanceModule } from '@schaeffler/empty-states';
import { LegalPath, LegalRoute } from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK, HEALTH_CHECK_STATE_MOCK } from '../testing/mocks';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { GlobalSearchBarModule } from './shared/components/global-search-bar/global-search-bar.module';
import { UserSettingsModule } from './shared/components/user-settings/user-settings.module';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@ngneat/transloco'),
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
      MockModule(UserSettingsModule),
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
