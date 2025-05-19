import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
} from '@angular/router';

import { ReplaySubject } from 'rxjs';

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
import { ApplicationInsightsService } from '@schaeffler/application-insights';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { MaintenanceModule } from '@schaeffler/empty-states';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { LegalPath } from '@schaeffler/legal-pages';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AUTH_STATE_MOCK, HEALTH_CHECK_STATE_MOCK } from '../testing/mocks';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HealthCheckFacade } from './core/store/health-check/health-check.facade';
import { GlobalSearchBarModule } from './shared/components/global-search-bar/global-search-bar.module';
import { UserSettingsComponent } from './shared/components/user-settings/user-settings.component';
import { UserSettingsService } from './shared/services/rest/user-settings/user-settings.service';

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
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': AUTH_STATE_MOCK,
          healthCheck: HEALTH_CHECK_STATE_MOCK,
        },
      }),

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
      mockProvider(HealthCheckFacade),
      mockProvider(ApplicationInsightsService),
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
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
      store.dispatch = jest.fn();
      component.handleCurrentRoute = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.handleCurrentRoute).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleCurrentRoute', () => {
    test(
      'should set showGlobalSearch$ to true when url starts with /case-view',
      marbles((m) => {
        // Arrange
        const url = '/case-view/123';
        routerMock.url = url;
        // Simulate NavigationEnd event
        const navigationEnd = {
          url,
          instanceof: () => true,
        } as unknown as NavigationEnd;
        eventSubject.next(navigationEnd);

        // Act
        component.handleCurrentRoute();

        // Assert
        const expected$ = m.cold('(a)', { a: true });
        m.expect(component.showGlobalSearch$).toBeObservable(expected$);
      })
    );

    test(
      'should set showGlobalSearch$ to false when url does not start with /case-view',
      marbles((m) => {
        // Arrange
        const url = '/other-route';
        routerMock.url = url;
        // Simulate NavigationEnd event
        const navigationEnd = {
          url,
          instanceof: () => true,
        } as unknown as NavigationEnd;
        eventSubject.next(navigationEnd);

        // Act
        component.handleCurrentRoute();

        // Assert
        const expected$ = m.cold('(a)', { a: false });
        m.expect(component.showGlobalSearch$).toBeObservable(expected$);
      })
    );
  });
});
