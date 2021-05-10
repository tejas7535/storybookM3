import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { getIsLoggedIn, startLoginFlow } from '@schaeffler/auth';
import { FooterModule } from '@schaeffler/footer';
import { HeaderModule } from '@schaeffler/header';

import { MatDialog } from '@angular/material/dialog';
import { LoadingSpinnerModule } from '@cdba/shared/components';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock';

import { BrowserDetectionService } from '@cdba/shared/services';
import { cold } from 'jest-marbles';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;
  let store: MockStore;
  let browserSupportDialog: SpyObject<MatDialog>;
  let browserDetectionService: SpyObject<BrowserDetectionService>;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      HeaderModule,
      FooterModule,
      MatButtonModule,
      LoadingSpinnerModule,
      RouterTestingModule,
      ReactiveComponentModule,
    ],
    mocks: [BrowserDetectionService, MatDialog],
    providers: [
      provideMockStore({
        initialState: {
          auth: {
            user: {
              username: 'John',
              department: 'C-IT',
            },
          },
        },
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    store = spectator.inject(MockStore);
    store.dispatch = jest.fn();

    browserSupportDialog = spectator.inject(MatDialog);
    browserDetectionService = spectator.inject(BrowserDetectionService);
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  test(`should have as title 'Cost Database Analytics'`, () => {
    expect(component.title).toEqual('Cost Database Analytics');
  });

  describe('ngOnInit', () => {
    test('should set observables', () => {
      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();

      expect(component.isLessThanMediumViewport$).toBeDefined();
      expect(component.username$).toBeDefined();
    });

    test('dispatch login on application load', () => {
      browserDetectionService.isUnsupportedBrowser.andReturn(true);

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();

      expect(store.dispatch).toHaveBeenCalledWith(startLoginFlow());
    });

    test('should display browser support dialog for authenticated users using an unsupported browser', () => {
      store.overrideSelector(getIsLoggedIn, true);
      browserDetectionService.isUnsupportedBrowser.andReturn(true);

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();

      expect(component.isLoggedIn$).toBeObservable(cold('a', { a: true }));

      expect(component.isLoggedIn$).toSatisfyOnFlush(() => {
        expect(browserSupportDialog.open).toHaveBeenCalled();
      });
    });

    test('should not display browser support dialog for unauthenticated users using an unsupported browser', () => {
      store.overrideSelector(getIsLoggedIn, false);
      browserDetectionService.isUnsupportedBrowser.andReturn(true);

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();

      expect(component.isLoggedIn$).toBeObservable(cold('a', { a: false }));

      expect(component.isLoggedIn$).toSatisfyOnFlush(() => {
        expect(browserSupportDialog.open).not.toHaveBeenCalled();
      });
    });

    test('should not display browser support dialog for authenticated users using a supported browser', () => {
      store.overrideSelector(getIsLoggedIn, true);
      browserDetectionService.isUnsupportedBrowser.andReturn(false);

      // eslint-disable-next-line @angular-eslint/no-lifecycle-call
      component.ngOnInit();

      expect(component.isLoggedIn$).toBeObservable(cold('a', { a: true }));

      expect(component.isLoggedIn$).toSatisfyOnFlush(() => {
        expect(browserSupportDialog.open).not.toHaveBeenCalled();
      });
    });
  });
});
