import { FlexLayoutModule } from '@angular/flex-layout';
import { MATERIAL_SANITY_CHECKS } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { provideMockStore } from '@ngrx/store/testing';

import { toggleSidebar } from '@schaeffler/sidebar';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let component: HeaderComponent;

  const createComponent = createComponentFactory({
    component: HeaderComponent,
    imports: [
      NoopAnimationsModule,
      MatIconModule,
      MatToolbarModule,
      RouterTestingModule,
      FlexLayoutModule,
    ],
    providers: [
      provideMockStore(),
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
      expect(component.toggleEnabled).toBeDefined();
      expect(component.platformTitle).toBeUndefined();

      expect(component.toggle).toBeDefined();
    });

    it('should define the default values', () => {
      expect(component.toggleEnabled).toBeFalsy();
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe fromSubscription', () => {
      const spy = jest.spyOn(component['subscription'], 'unsubscribe');

      component.ngOnDestroy();

      expect(spy).toHaveBeenCalled();
    });
  });

  describe('toggleClicked()', () => {
    beforeEach(() => {
      spectator.setInput('toggleEnabled', true);
      spectator.detectChanges();
    });

    it('should be triggered by click at burgerButton', () => {
      jest.spyOn(component, 'toggleClicked');
      const burgerMenu = spectator.query('#burger-menu');
      spectator.click(burgerMenu);

      expect(component.toggleClicked).toHaveBeenCalled();
    });

    it('should emit event', () => {
      component.toggle.emit = jest.fn();

      component.toggleClicked();
      expect(component.toggle.emit).toHaveBeenCalled();
    });

    it('should dispatch toogleSidebar Action', () => {
      component['store'].dispatch = jest.fn();

      component.toggleClicked();
      expect(component['store'].dispatch).toHaveBeenCalled();
      expect(component['store'].dispatch).toHaveBeenCalledWith(toggleSidebar());
    });
  });

  describe('template test', () => {
    it('should display a platformTitle', () => {
      const platformTitle = 'Nebuchadnezzar Shipment';
      spectator.setInput('platformTitle', platformTitle);
      spectator.detectChanges();
      const userMenu = spectator.query('#platform-header');
      expect(userMenu.innerHTML).toContain(platformTitle);
    });

    it('should display a burgerMenu', () => {
      let burgerMenu = spectator.query('#burger-menu');
      expect(burgerMenu).toBeFalsy();

      spectator.setInput('toggleEnabled', true);
      spectator.detectChanges();

      burgerMenu = spectator.query('#burger-menu');
    });
  });
});
