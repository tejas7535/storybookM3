import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NavigationEnd, RouterEvent } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import { MockModule } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { AppShellModule } from '../../app-shell.module';
import { AppShellFooterLink } from '../../models';
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

    (component['router'].events as unknown as Subject<RouterEvent>).next(
      new NavigationEnd(1, 'url', 'fullUrl')
    );

    expect(spy).toHaveBeenCalledWith({ top: 0 });
  });

  it('should not scroll to top by default', () => {
    const spy = jest.spyOn(component['sidenavContent'], 'scrollTo');

    component.scrollToTop = false;
    component.ngOnInit();

    (component['router'].events as unknown as Subject<RouterEvent>).next(
      new NavigationEnd(1, 'url', 'fullUrl')
    );

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('calls the link handler with the event', () => {
    const internalSpyHandler = jest.fn();
    const externalSpyHandler = jest.fn();

    const footerLinks: AppShellFooterLink[] = [
      {
        link: '/',
        title: 'Click here',
        onClick: internalSpyHandler,
      },
      {
        link: 'https://schaeffler.com',
        title: 'External Link',
        onClick: externalSpyHandler,
        external: true,
      },
    ];
    spectator = createComponent({
      props: {
        footerLinks,
      },
    });
    component = spectator.component;

    const internalLink = spectator.query('div.footer-link-internal');
    const externalLink = spectator.query('a.footer-link-external');

    spectator.click(internalLink);
    spectator.click(externalLink);

    expect(internalSpyHandler).toHaveBeenCalledTimes(1);
    expect(internalSpyHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
    expect(externalSpyHandler).toHaveBeenCalledTimes(1);
    expect(externalSpyHandler).toHaveBeenCalledWith(expect.any(MouseEvent));
  });

  it('closes mat sidenav on component property change', () => {
    expect(spectator.query(MatSidenav).opened).toBe(false);

    spectator.setInput('showSideNav', true);
    spectator.detectChanges();

    expect(spectator.query(MatSidenav).opened).toBe(true);
  });

  it('should emit change when component changes sideNav state', () => {
    const emitSpy = jest.spyOn(component.sidenavOpenChange, 'emit');
    component.sidenavOpen = true;

    expect(emitSpy).toHaveBeenCalledWith(true);
  });

  it('should not emit anything when input changes sideNav state', () => {
    const emitSpy = jest.spyOn(component.sidenavOpenChange, 'emit');
    spectator.setInput('showSideNav', true);

    expect(emitSpy).toHaveBeenCalledTimes(0);
  });

  it('should emit event when closing sidebar with the burger menu', () => {
    component.sidenavOpen = true;
    component.hasSidebarLeft = true;
    spectator.detectChanges();
    spectator.detectComponentChanges();

    const emitSpy = jest.spyOn(component.sidenavOpenChange, 'emit');
    const burgerMenu = spectator.query('button');
    spectator.click(burgerMenu);

    expect(emitSpy).toHaveBeenCalledWith(false);
  });

  it('should emit event when opening the sidebar with the burger menu', () => {
    component.sidenavOpen = false;
    component.hasSidebarLeft = true;
    spectator.detectChanges();
    spectator.detectComponentChanges();

    const emitSpy = jest.spyOn(component.sidenavOpenChange, 'emit');
    const burgerMenu = spectator.query('button');
    spectator.click(burgerMenu);

    expect(emitSpy).toHaveBeenCalledWith(true);
  });
});
