import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppShellModule } from '@schaeffler/app-shell';

import {
  BrowserSupportModule,
  LoadingSpinnerModule,
  UserSettingsModule,
} from '@cdba/shared/components';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let spectator: Spectator<AppComponent>;
  let component: AppComponent;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      RouterTestingModule,
      ReactiveComponentModule,
      provideTranslocoTestingModule({ en: {} }),
      AppShellModule,
      LoadingSpinnerModule,
      UserSettingsModule,
      BrowserSupportModule,
      MatButtonModule,
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
        },
      }),
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
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

  describe('ngOnInit', () => {
    test('should set observables', () => {
      component.ngOnInit();

      expect(component.isLoggedIn$).toBeDefined();
      expect(component.username$).toBeDefined();
      expect(component.profileImage$).toBeDefined();
    });
  });
});
