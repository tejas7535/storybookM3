import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { SpyObject } from '@ngneat/spectator/jest/lib/mock';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold } from 'jest-marbles';

import { getIsLoggedIn } from '@schaeffler/azure-auth';
import { FooterTailwindModule } from '@schaeffler/footer-tailwind';
import { HeaderModule } from '@schaeffler/header';

import { LoadingSpinnerModule } from '@cdba/shared/components';
import { BrowserDetectionService } from '@cdba/shared/services';

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
      FooterTailwindModule,
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
      component.ngOnInit();

      expect(component.isLoggedIn$).toBeDefined();
      expect(component.username$).toBeDefined();
      expect(component.profileImage$).toBeDefined();
    });

    test('should display browser support dialog for authenticated users using an unsupported browser', () => {
      store.overrideSelector(getIsLoggedIn, true);
      browserDetectionService.isUnsupportedBrowser.andReturn(true);

      component.ngOnInit();

      expect(component.isLoggedIn$).toBeObservable(cold('a', { a: true }));

      expect(component.isLoggedIn$).toSatisfyOnFlush(() => {
        expect(browserSupportDialog.open).toHaveBeenCalled();
      });
    });

    test('should not display browser support dialog for unauthenticated users using an unsupported browser', () => {
      store.overrideSelector(getIsLoggedIn, false);
      browserDetectionService.isUnsupportedBrowser.andReturn(true);

      component.ngOnInit();

      expect(component.isLoggedIn$).toBeObservable(cold('a', { a: false }));

      expect(component.isLoggedIn$).toSatisfyOnFlush(() => {
        expect(browserSupportDialog.open).not.toHaveBeenCalled();
      });
    });

    test('should not display browser support dialog for authenticated users using a supported browser', () => {
      store.overrideSelector(getIsLoggedIn, true);
      browserDetectionService.isUnsupportedBrowser.andReturn(false);

      component.ngOnInit();

      expect(component.isLoggedIn$).toBeObservable(cold('a', { a: true }));

      expect(component.isLoggedIn$).toSatisfyOnFlush(() => {
        expect(browserSupportDialog.open).not.toHaveBeenCalled();
      });
    });
  });
});
