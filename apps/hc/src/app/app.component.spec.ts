import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { of } from 'rxjs';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockModule } from 'ng-mocks';

import { AppShellComponent, AppShellModule } from '@schaeffler/app-shell';
import { SharedAzureAuthModule } from '@schaeffler/azure-auth';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../assets/i18n/en.json';
import { AppComponent } from './app.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';
import { AuthService } from './services/auth.service';
import { InternalUserCheckService } from './services/internal-user-check.service';

jest.mock('@jsverse/transloco', () => ({
  ...jest.requireActual<TranslocoModule>('@jsverse/transloco'),
  translate: jest.fn((string) => string),
}));

describe('AppComponent', () => {
  let component: AppComponent;
  let spectator: Spectator<AppComponent>;
  const eventSubject = new ReplaySubject<RouterEvent>(1);
  const routerMock = {
    navigate: jest.fn(),
    events: eventSubject.asObservable(),
    url: 'testApp/url',
  };

  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [
      PushPipe,
      SharedTranslocoModule,
      RouterTestingModule,
      MockComponent(SettingsPanelComponent),
      MockModule(AppShellModule),
      MockModule(SharedAzureAuthModule),
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      provideMockStore({}),
      {
        provide: Router,
        useValue: routerMock,
      },
      {
        provide: AuthService,
        useValue: {
          login: jest.fn(),
          logout: jest.fn(),
          isLoggedin: jest.fn(() => of(true)),
          getProfilePictureUrl: jest.fn(() => of('urldotcom')),
          getUsername: jest.fn(() => of('Max Mustermann')),
        },
      },
      {
        provide: InternalUserCheckService,
        useValue: {
          isInternalUser: jest.fn(() => of(true)),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include settings panel', () => {
    expect(spectator.query(SettingsPanelComponent)).toBeTruthy();
  });

  it('should include app shell with configuration', () => {
    const appShell: AppShellComponent = spectator.query(AppShellComponent);

    expect(appShell).toBeTruthy();
    expect(appShell.appTitle).toBe(component.appTitle);
    expect(appShell.appVersion).toBe(component.appVersion);
    expect(appShell.appTitleLink).toBe('/');
    expect(appShell.footerFixed).toBe(false);
    expect(appShell.scrollToTop).toBe(true);
    expect(appShell.footerLinks).toEqual([
      {
        external: false,
        link: 'legal/imprint',
        title: 'Imprint',
      },
      {
        external: false,
        link: 'legal/data-privacy',
        title: 'Data Privacy',
      },
      {
        external: false,
        link: 'legal/terms-of-use',
        title: 'Terms of Use',
      },
      {
        external: false,
        link: 'legal/cookie-policy',
        title: 'Cookie Policy',
      },
    ]);
  });

  it('should not be on cookie page', () => {
    expect(component.isCookiePage).toBe(false);
  });

  describe('when navigating to cookie page', () => {
    beforeEach(() => {
      eventSubject.next(
        new NavigationEnd(1, `legal/cookie-policy`, 'redirectPath')
      );
    });

    it('should be on cookie page', () => {
      expect(component.isCookiePage).toBe(true);
    });
  });

  describe('when using internal user detection', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    it('should login for non-logged in internal users', () => {
      component['internalDetection'].isInternalUser = jest.fn(() => of(true));
      component['authService'].isLoggedin = jest.fn(() => of(false));

      component.ngOnInit();
      expect(component['authService'].login).toHaveBeenCalled();
      expect(component['internalDetection'].isInternalUser).toHaveBeenCalled();
      expect(component['authService'].isLoggedin).toHaveBeenCalled();
    });

    it('should not login for logged in internal users', () => {
      component['internalDetection'].isInternalUser = jest.fn(() => of(true));
      component['authService'].isLoggedin = jest.fn(() => of(true));

      component.ngOnInit();
      expect(component['authService'].login).not.toHaveBeenCalled();
      expect(component['internalDetection'].isInternalUser).toHaveBeenCalled();
      expect(component['authService'].isLoggedin).toHaveBeenCalled();
    });

    it('should not login for non-logged in external users', () => {
      component['internalDetection'].isInternalUser = jest.fn(() => of(false));
      component['authService'].isLoggedin = jest.fn(() => of(false));

      component.ngOnInit();
      expect(component['authService'].login).not.toHaveBeenCalled();
      expect(component['internalDetection'].isInternalUser).toHaveBeenCalled();
      expect(component['authService'].isLoggedin).not.toHaveBeenCalled();
    });
  });
});
