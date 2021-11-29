import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationEnd, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { ReactiveComponentModule } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import { AppShellModule } from '@schaeffler/app-shell';
import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { HeaderModule } from '@schaeffler/header';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { RoutePath } from './app-routing.enum';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      NoopAnimationsModule,
      HeaderModule,
      MatButtonModule,
      RouterTestingModule,
      ReactiveComponentModule,
      AppShellModule,
      provideTranslocoTestingModule({ en: {} }),
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
        provide: ApplicationInsightsService,
        useValue: {
          logEvent: jest.fn(),
        },
      },
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    declarations: [AppComponent],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.debugElement.componentInstance;
    store = spectator.inject(MockStore);
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  describe('Init component', () => {
    it('should be initialize', () => {
      store.dispatch = jest.fn();

      component.ngOnInit();

      expect(component.username$).toBeDefined();
      expect(component.profileImage$).toBeDefined();
    });
  });

  describe('link', () => {
    it('should return nothing by default', () => {
      expect(component.link).toEqual(false);
    });

    it('should return a link to overview only when in hardness-conversion', () => {
      component.url = `/${RoutePath.HardnessConverterPath}`;
      expect(component.link).toEqual(`/${RoutePath.OverviewPath}`);
    });

    it('should get the link from router', () => {
      (component['router'].events as Subject<RouterEvent>).next(
        new NavigationEnd(1, 'url', 'fullUrl')
      );

      expect(component.url).toEqual('url');
    });
  });
});
