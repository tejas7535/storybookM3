import { MatButtonModule } from '@angular/material/button';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterTestingModule } from '@angular/router/testing';

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
    });
  });

  it('should close the sidenav on esc', () => {
    component.sidenavOpen = true;
    component.onEscKeyUp();

    expect(component.sidenavOpen).toBeFalsy();
  });
});
