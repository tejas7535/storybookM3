import { createDirectiveFactory, SpectatorDirective } from '@ngneat/spectator';

import { ScrollToTopDirective } from './scroll-to-top.directive';

describe('ScrollToTopDirective', () => {
  let spectator: SpectatorDirective<ScrollToTopDirective>;
  let directive: ScrollToTopDirective;

  const createDirective = createDirectiveFactory(ScrollToTopDirective);

  beforeEach(() => {
    spectator = createDirective(
      `<div schaefflerScrollToTop>Testing Scroll To Top Directive</div>`
    );
    directive = spectator.directive;
  });

  it('should get the instance', () => {
    expect(directive).toBeDefined();
  });

  describe('onScroll', () => {
    test('should pass target element of scroll event', () => {
      const spy = jest.spyOn(directive.scrollEvent$, 'next');

      spectator.dispatchMouseEvent(spectator.element, 'scroll');

      expect(spy).toHaveBeenCalled();
    });
  });
});
