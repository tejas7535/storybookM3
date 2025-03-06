import { CdkOverlayOrigin } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { HtmlTooltipComponent } from './html-tooltip.component';

describe('HtmlTooltipComponent', () => {
  let component: HtmlTooltipComponent;
  let spectator: Spectator<HtmlTooltipComponent>;

  const createComponent = createComponentFactory({
    component: HtmlTooltipComponent,
    detectChanges: false,
    imports: [CommonModule, MatIconModule],
  });

  beforeEach(() => {
    spectator = createComponent();

    const element = document.createElement('div');
    spectator.setInput({
      tooltipOrigin: {
        elementRef: {
          nativeElement: element,
        },
      } as unknown as CdkOverlayOrigin,
    });

    spectator.detectChanges();

    component = spectator.debugElement.componentInstance;
  });

  describe('onInit', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });
    it('should not change state on mouseenter if already open', () => {
      const mockEvent: Event = new Event('mouseenter');
      component['isMovedOutside'] = jest.fn();
      component['changeState'] = jest.fn();

      component.isOpened = true;

      component.tooltipOrigin.elementRef.nativeElement.dispatchEvent(mockEvent);

      jest.advanceTimersByTime(1000);

      expect(component['isMovedOutside']).not.toHaveBeenCalled();
      expect(component['changeState']).not.toHaveBeenCalled();
    });

    it('should not change state if moved out', () => {
      const mockEvent: Event = new Event('mouseenter');
      component['isMovedOutside'] = jest.fn(() => true);
      component['changeState'] = jest.fn();

      component.isOpened = false;

      component.tooltipOrigin.elementRef.nativeElement.dispatchEvent(mockEvent);

      jest.advanceTimersByTime(1000);

      expect(component['isMovedOutside']).toHaveBeenCalled();
      expect(component['changeState']).not.toHaveBeenCalled();
    });
    it('should change state after timeout', () => {
      const mockEvent: Event = new Event('mouseenter');
      component['isMovedOutside'] = jest.fn(() => false);
      component['changeState'] = jest.fn();

      component.isOpened = false;

      component.tooltipOrigin.elementRef.nativeElement.dispatchEvent(mockEvent);

      jest.advanceTimersByTime(1000);

      expect(component['isMovedOutside']).toHaveBeenCalled();
      expect(component['changeState']).toHaveBeenCalledWith(true);
    });
    it('should not react to mousemove if not open', () => {
      const mockEvent: Event = new Event('mousemove');
      component['isMovedOutside'] = jest.fn(() => false);
      component['changeState'] = jest.fn();

      component.isOpened = false;

      document.dispatchEvent(mockEvent);

      jest.advanceTimersByTime(1000);

      expect(component['isMovedOutside']).not.toHaveBeenCalled();
      expect(component['changeState']).not.toHaveBeenCalled();
    });

    it('should not close if not moved out', () => {
      const mockEvent: Event = new Event('mousemove');
      component['isMovedOutside'] = jest.fn(() => false);
      component['changeState'] = jest.fn();

      component.isOpened = true;

      document.dispatchEvent(mockEvent);

      jest.advanceTimersByTime(1000);

      expect(component['isMovedOutside']).toHaveBeenCalled();
      expect(component['changeState']).not.toHaveBeenCalled();
    });

    it('should close if moved out', () => {
      const mockEvent: Event = new Event('mousemove');
      component['isMovedOutside'] = jest.fn(() => true);
      component['changeState'] = jest.fn();

      component.isOpened = true;

      document.dispatchEvent(mockEvent);

      jest.advanceTimersByTime(1000);

      expect(component['isMovedOutside']).toHaveBeenCalled();
      expect(component['changeState']).toHaveBeenCalledWith(false);
    });
  });

  describe('onDestroy', () => {
    it('should complete the observable', () => {
      component.destroy$.next = jest.fn();
      component.destroy$.complete = jest.fn();

      component.ngOnDestroy();

      expect(component.destroy$.next).toHaveBeenCalled();
      expect(component.destroy$.complete).toHaveBeenCalled();
    });
  });

  describe('connectedOverlayDetach', () => {
    it('should call changeState after timeout', () => {
      jest.useFakeTimers();

      component['changeState'] = jest.fn();

      component.connectedOverlayDetach();

      jest.advanceTimersByTime(1000);

      expect(component['changeState']).toHaveBeenCalledWith(false);

      jest.useRealTimers();
    });
  });

  describe('changeState', () => {
    it('should change the state', () => {
      expect(component.isOpened).toBe(false);

      component['changeDetectorRef'].markForCheck = jest.fn();

      component['changeState'](true);

      expect(component.isOpened).toBe(true);
      expect(component['changeDetectorRef'].markForCheck).toHaveBeenCalled();
    });
  });

  describe('isMovedOutside', () => {
    let tooltip: {
      nativeElement: {
        getBoundingClientRect: () => {
          left: number;
          right: number;
          top: number;
          bottom: number;
        };
      };
    };
    let tooltipOrigin: {
      elementRef: {
        nativeElement: {
          getBoundingClientRect: () => {
            left: number;
            right: number;
            top: number;
            bottom: number;
          };
        };
      };
    };

    beforeEach(() => {
      tooltip = {
        nativeElement: {
          getBoundingClientRect: jest.fn(() => ({
            left: 0,
            right: 100,
            top: 0,
            bottom: 100,
          })),
        },
      };
      tooltipOrigin = {
        elementRef: {
          nativeElement: {
            getBoundingClientRect: jest.fn(() => ({
              left: 100,
              right: 0,
              top: 100,
              bottom: 0,
            })),
          },
        },
      };
    });

    it('should return false if cursor is over tooltip', () => {
      component.tooltipOrigin = tooltipOrigin;
      component['isCursorOverRect'] = jest.fn((rect) => rect.left === 0);

      const result = component['isMovedOutside'](tooltip);

      expect(result).toBe(false);
      expect(component['isCursorOverRect']).toHaveBeenCalledTimes(2);
      expect(tooltip.nativeElement.getBoundingClientRect).toHaveBeenCalled();
      expect(
        tooltipOrigin.elementRef.nativeElement.getBoundingClientRect
      ).toHaveBeenCalled();
    });

    it('should return false if cursor is over tooltipOrigin', () => {
      component.tooltipOrigin = tooltipOrigin;
      component['isCursorOverRect'] = jest.fn((rect) => rect.left !== 0);

      const result = component['isMovedOutside'](tooltip);

      expect(result).toBe(false);
      expect(component['isCursorOverRect']).toHaveBeenCalledTimes(1);
      expect(tooltip.nativeElement.getBoundingClientRect).toHaveBeenCalled();
      expect(
        tooltipOrigin.elementRef.nativeElement.getBoundingClientRect
      ).toHaveBeenCalled();
    });

    it('should return true if cursor is not over tooltip or tooltipOrigin', () => {
      component.tooltipOrigin = tooltipOrigin;
      component['isCursorOverRect'] = jest.fn(() => false);

      const result = component['isMovedOutside'](tooltip);

      expect(result).toBe(true);
      expect(component['isCursorOverRect']).toHaveBeenCalledTimes(2);
      expect(tooltip.nativeElement.getBoundingClientRect).toHaveBeenCalled();
      expect(
        tooltipOrigin.elementRef.nativeElement.getBoundingClientRect
      ).toHaveBeenCalled();
    });
  });

  describe('isCursorOverRect', () => {
    it('should return false if rect is falsy', () => {
      const result = component['isCursorOverRect']();

      expect(result).toBe(false);
    });

    it('should return true if cursor is over rect', () => {
      const rect = {
        left: 0,
        right: 100,
        top: 0,
        bottom: 100,
      };

      component.cursorX = 50;
      component.cursorY = 50;

      const result = component['isCursorOverRect'](rect);

      expect(result).toBe(true);
    });

    it('should return false if cursor is not over rect', () => {
      const rect = {
        left: 0,
        right: 100,
        top: 0,
        bottom: 100,
      };

      component.cursorX = 101;
      component.cursorY = 101;

      const result = component['isCursorOverRect'](rect);

      expect(result).toBe(false);
    });
  });
});
