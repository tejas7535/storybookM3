import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppShellModule } from '@schaeffler/app-shell';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
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
      MatButtonModule,
      RouterTestingModule,
      PushModule,
      MatProgressSpinnerModule,
      LoadingSpinnerModule,
      AppShellModule,
      provideTranslocoTestingModule({
        en: {
          userPanelAccountLinkLabel: 'Mein Konto',
        },
      }),
    ],
    providers: [
      provideMockStore({
        initialState: {
          'azure-auth': {
            accountInfo: {
              name: 'John',
              department: 'C-IT',
            },
            profileImage: {
              url: 'abc',
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
  });

  test('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    test('should set observables and dispatch login', () => {
      store.dispatch = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.profileImage$).toBeDefined();
      expect(component.getIsLoggedIn$).toBeDefined();
    });
  });
});
