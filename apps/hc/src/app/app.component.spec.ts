import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

import { TranslocoModule } from '@jsverse/transloco';
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockComponent, MockModule } from 'ng-mocks';

import { AppShellComponent, AppShellModule } from '@schaeffler/app-shell';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as en from '../assets/i18n/en.json';
import { AppComponent } from './app.component';
import { SettingsPanelComponent } from './components/settings-panel/settings-panel.component';

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
      provideTranslocoTestingModule({ en }),
    ],
    providers: [
      {
        provide: Router,
        useValue: routerMock,
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
});
