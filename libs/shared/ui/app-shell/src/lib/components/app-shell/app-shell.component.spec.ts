import { RouterTestingModule } from '@angular/router/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';

import { MockModule } from 'ng-mocks';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

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
    });
  });

  it('should close the sidenav on esc', () => {
    component.sidenavOpen = true;
    component.onEscKeyUp();

    expect(component.sidenavOpen).toBeFalsy();
  });
});
