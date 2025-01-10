import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { CalculationDowstreamSwipeDirective } from './calculation-downstream-swipe.directive';

describe('CalculationDowstreamSwipeDirective', () => {
  let spectator: SpectatorDirective<CalculationDowstreamSwipeDirective>;
  const createDirective = createDirectiveFactory(
    CalculationDowstreamSwipeDirective
  );

  beforeEach(() => {
    spectator = createDirective(`<div contentSwipe></div>`);
  });

  it('should create an instance', () => {
    expect(spectator.directive).toBeTruthy();
  });

  it('should emit swipeLeft event on left swipe', () => {
    const swipeLeftSpy = jest.spyOn(spectator.directive.swipeLeft, 'emit');

    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [
        {
          identifier: 0,
          target: spectator.element,
          clientX: 50,
          clientY: 0,
        } as unknown as Touch,
      ],
    });
    const touchEndEvent = new TouchEvent('touchend', {
      changedTouches: [
        {
          identifier: 0,
          target: spectator.element,
          clientX: 100,
          clientY: 0,
        } as unknown as Touch,
      ],
    });

    spectator.element.dispatchEvent(touchStartEvent);
    spectator.element.dispatchEvent(touchEndEvent);

    expect(swipeLeftSpy).toHaveBeenCalled();
  });

  it('should emit swipeRight event on right swipe', () => {
    const swipeRightSpy = jest.spyOn(spectator.directive.swipeRight, 'emit');

    const touchStartEvent = new TouchEvent('touchstart', {
      touches: [
        {
          identifier: 0,
          target: spectator.element,
          clientX: 50,
          clientY: 0,
        } as unknown as Touch,
      ],
    });
    const touchEndEvent = new TouchEvent('touchend', {
      changedTouches: [
        {
          identifier: 0,
          target: spectator.element,
          clientX: -100,
          clientY: 0,
        } as unknown as Touch,
      ],
    });

    spectator.element.dispatchEvent(touchStartEvent);
    spectator.element.dispatchEvent(touchEndEvent);

    expect(swipeRightSpy).toHaveBeenCalled();
  });

  it('should not emit any event on vertical swipe', () => {
    const swipeLeftSpy = jest.spyOn(spectator.directive.swipeLeft, 'emit');
    const swipeRightSpy = jest.spyOn(spectator.directive.swipeRight, 'emit');

    spectator.dispatchTouchEvent(spectator.element, 'touchstart', 50, 0);
    spectator.dispatchTouchEvent(spectator.element, 'touchend', 50, 50);

    expect(swipeLeftSpy).not.toHaveBeenCalled();
    expect(swipeRightSpy).not.toHaveBeenCalled();
  });
});
