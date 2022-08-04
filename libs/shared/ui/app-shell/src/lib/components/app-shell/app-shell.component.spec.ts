import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppShellModule } from '../../app-shell.module';
import { AppShellComponent } from './app-shell.component';

describe('AppShellComponent', () => {
  let spectator: Spectator<AppShellComponent>;
  let component: AppShellComponent;

  const createComponent = createComponentFactory({
    component: AppShellComponent,
    imports: [
      RouterTestingModule,
      MatButtonModule,
      MatDividerModule,
      MatIconModule,
      MatSidenavModule,
      MatToolbarModule,
      provideTranslocoTestingModule({ en: {} }),
      MockModule(AppShellModule),
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;

    component['sidenavContent'].scrollTo = jest.fn();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Properties and Inputs', () => {
    it('should define the properties', () => {
      expect(component.appTitle).toBeUndefined();
      expect(component.appTitleLink).toBeUndefined();
      expect(component.hasSidebarLeft).toBeDefined();
      expect(component.userName).toBeUndefined();
      expect(component.userImageUrl).toBeUndefined();
      expect(component.sidenavOpen).toBeFalsy();
      expect(component.hasFooter).toBeFalsy();
      expect(component.footerFixed).toBeTruthy();
      expect(component.footerLinks.length).toBe(0);
      expect(component.appVersion).toBeUndefined();
      expect(component.scrollToTop).toBeFalsy();
    });
  });

  it('should close the sidenav on esc', () => {
    component.sidenavOpen = true;
    component.onEscKeyUp();

    expect(component.sidenavOpen).toBeFalsy();
  });

  it('should scroll to top if input says so', () => {
    const spy = jest.spyOn(component['sidenavContent'], 'scrollTo');

    component.scrollToTop = true;
    component.ngOnInit();

    (component['router'].events as Subject<RouterEvent>).next(
      new NavigationEnd(1, 'url', 'fullUrl')
    );

    expect(spy).toBeCalledWith({ top: 0 });
  });

  it('should not scroll to top by default', () => {
    const spy = jest.spyOn(component['sidenavContent'], 'scrollTo');

    component.scrollToTop = false;
    component.ngOnInit();

    (component['router'].events as Subject<RouterEvent>).next(
      new NavigationEnd(1, 'url', 'fullUrl')
    );

    expect(spy).toBeCalledTimes(0);
  });
});
