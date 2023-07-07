import { Spectator, createComponentFactory } from '@ngneat/spectator';
import { HtmlTooltipComponent } from './html-tooltip.component';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { ElementRef } from '@angular/core';
import { CdkOverlayOrigin } from '@angular/cdk/overlay';

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
      tooltip: {
        nativeElement: {},
      } as unknown as ElementRef<any>,
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
    let element: HTMLDivElement;
    let tooltip: HTMLDivElement;

    beforeEach(() => {
      element = document.createElement('div');
      element.innerHTML = 'origin';
      tooltip = document.createElement('div');
      tooltip.innerHTML = 'tooltip';
    });

    it('should return true', () => {
      const mockElement = element;

      const mockTooltip = {
        nativeElement: tooltip,
      } as ElementRef<any>;

      const mockEvent = {
        target: document.createElement('span'),
      } as unknown as Event;

      const result = component['isMovedOutside'](
        mockElement,
        mockTooltip,
        mockEvent
      );

      expect(result).toBe(true);
    });

    it('should return true if target is inside element', () => {
      const mockElement = element;

      const mockTooltip = {
        nativeElement: tooltip,
      } as ElementRef<any>;

      const mockEvent = {
        target: element,
      } as unknown as Event;

      const result = component['isMovedOutside'](
        mockElement,
        mockTooltip,
        mockEvent
      );

      expect(result).toBe(false);
    });

    it('should return true if target is inside tooltip', () => {
      const mockElement = element;

      const mockTooltip = {
        nativeElement: tooltip,
      } as ElementRef<any>;

      const mockEvent = {
        target: tooltip,
      } as unknown as Event;

      const result = component['isMovedOutside'](
        mockElement,
        mockTooltip,
        mockEvent
      );

      expect(result).toBe(false);
    });
  });
});
