import {
  MATERIAL_SANITY_CHECKS,
  MatRippleModule,
} from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';
import resize_observer_polyfill from 'resize-observer-polyfill';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { BomOverlayComponent } from './bom-overlay.component';

window.ResizeObserver = resize_observer_polyfill;

describe('BomOverlayComponent', () => {
  let spectator: Spectator<BomOverlayComponent>;
  let component: BomOverlayComponent;

  const createComponent = createComponentFactory({
    component: BomOverlayComponent,
    imports: [
      provideTranslocoTestingModule({ en: {} }),
      MatIconModule,
      MatTabsModule,
      MatRippleModule,
    ],
    providers: [
      {
        provide: MATERIAL_SANITY_CHECKS,
        useValue: false,
      },
    ],
    disableAnimations: true,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should create ResizeObserver', () => {
      component['observer'] = undefined;

      component.ngOnInit();

      expect(component['observer']).toBeTruthy();
    });
  });

  describe('onClose', () => {
    it('should emit close event', () => {
      component['closeOverlay'].emit = jest.fn();

      component.onClose();

      expect(component['closeOverlay'].emit).toHaveBeenCalled();
    });
  });

  describe('ngOnDestroy', () => {
    it('should do nothing if observer is not defined', () => {
      component['observer'] = undefined;

      component.ngOnDestroy();

      expect(component['observer']).toBeUndefined();
    });
    it('should unobserve', () => {
      component['observer'] = {
        unobserve: jest.fn(),
      } as unknown as ResizeObserver;
      const unobserveSpy = jest.spyOn(component['observer'], 'unobserve');

      component.ngOnDestroy();

      expect(component['observer']).toBeTruthy();
      expect(unobserveSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('adjustWidth', () => {
    it('should do nothing when widths are equal', () => {
      const windowEventSpy = jest.spyOn(window, 'dispatchEvent');
      component['width'] = 10;

      component['adjustWidth'](10);

      expect(component['width']).toBe(10);
      expect(windowEventSpy).not.toHaveBeenCalled();
    });
    it('should dispatch resize event', () => {
      jest.useFakeTimers();
      const windowEventSpy = jest.spyOn(window, 'dispatchEvent');
      component['width'] = 10;

      component['adjustWidth'](20);

      expect(component['width']).toBe(20);
      jest.advanceTimersByTime(6);
      expect(windowEventSpy).toHaveBeenCalledTimes(1);
      expect(windowEventSpy).toHaveBeenCalledWith(new Event('resize'));
      jest.useRealTimers();
    });
  });
});
