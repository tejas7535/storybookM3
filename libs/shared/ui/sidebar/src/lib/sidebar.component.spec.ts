import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { SidebarMode } from './models';
import { SidebarComponent } from './sidebar.component';
import { initialState } from './store/reducers/sidebar.reducer';

describe('In SidebarComponent', () => {
  let spectator: Spectator<SidebarComponent>;
  let component: SidebarComponent;

  const createComponent = createComponentFactory({
    component: SidebarComponent,
    imports: [
      NoopAnimationsModule,
      MatSidenavModule,
      MatIconModule,
      RouterTestingModule,
    ],
    providers: [
      provideMockStore({ initialState: { sidebar: initialState } }),
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

  describe('Variables', () => {
    it('should define the properties', () => {
      expect(component.width).toEqual(260);
      expect(component.mode).toEqual(SidebarMode.Open);
      expect(component.isMobileViewPort).toBeFalsy();
    });
  });

  describe('sidebarAnimation()', () => {
    it('should animate with minify-mode if sidebar is minified', () => {
      component.mode = SidebarMode.Minified;
      component.isMobileViewPort = false;
      const expected = {
        value: 'minify',
        params: {
          width: `${component.width}px`,
        },
      };
      const animationStyle = component.sidebarAnimation;

      expect(animationStyle).toEqual(expected);
    });

    it('should animate with open-mode if sidebar is open or closed', () => {
      component.mode = SidebarMode.Open;
      component.isMobileViewPort = false;
      const expected = {
        value: 'open',
        params: {
          width: `${component.width}px`,
        },
      };
      let animationStyle = component.sidebarAnimation;
      expect(animationStyle).toEqual(expected);

      component.mode = SidebarMode.Closed;
      animationStyle = component.sidebarAnimation;
      expect(animationStyle).toEqual(expected);
    });

    it('should set sidebar width to 100 % if mobileViewPort is active', () => {
      component.mode = SidebarMode.Minified;
      component.isMobileViewPort = true;
      const expected = {
        value: 'minify',
        params: {
          width: '100%',
        },
      };
      const animationStyle = component.sidebarAnimation;

      expect(animationStyle).toEqual(expected);
    });
  });

  describe('contentAnimation()', () => {
    it('should animate with minify-mode if sidebar is minified', () => {
      component.mode = SidebarMode.Minified;
      const expected = {
        value: 'minify',
      };
      const animationStyle = component.contentAnimation;

      expect(animationStyle).toEqual(expected);
    });

    it('should animate with open-mode if sidebar is open or close', () => {
      component.mode = SidebarMode.Open;
      const expectedOpen = {
        value: 'open',
        params: {
          margin_left: `${component.width}px`,
        },
      };
      let animationStyle = component.contentAnimation;
      expect(animationStyle).toEqual(expectedOpen);

      component.mode = SidebarMode.Closed;
      animationStyle = component.contentAnimation;
      expect(animationStyle).toEqual(expectedOpen);
    });
  });

  describe('trackByFn()', () => {
    it('should return the loop index to track usersArray', () => {
      const indexNum = 1337;
      const retId = component.trackByFn(indexNum);
      expect(retId).toEqual(indexNum);
    });
  });
});
