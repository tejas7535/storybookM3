import { ElementRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { Subject } from 'rxjs';

import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ScrollToTopComponent } from './scroll-to-top.component';
import { ScrollToTopDirective } from './scroll-to-top.directive';

describe('ScrollToTopComponent', () => {
  const mockScrollToTopContainer = {
    scrollEvent$: new Subject<HTMLElement>(),
    element: new ElementRef('<div></div>'),
  };

  let spectator: Spectator<ScrollToTopComponent>;
  let component: ScrollToTopComponent;

  const createComponent = createComponentFactory({
    component: ScrollToTopComponent,
    imports: [MatIconModule, MatButtonModule, NoopAnimationsModule],
    declarations: [ScrollToTopDirective],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      Object.defineProperty(component, 'scrollToTopContainer', {
        value: mockScrollToTopContainer,
      });
    });

    test('should subscribe to scrollEvent if scrollToTopContainer is defined', () => {
      const spy = jest.spyOn(
        component['scrollToTopContainer'].scrollEvent$,
        'subscribe'
      );

      component.ngOnInit(); // eslint-disable-line @angular-eslint/no-lifecycle-call

      expect(spy).toHaveBeenCalled();
    });

    test('should set containerScrolled to true if the container is scrolled to more than 100px', () => {
      const container: HTMLElement = component['document'].createElement('div');
      container.scrollTop = 200;
      expect(component.containerScrolled).toEqual(undefined);

      component.ngOnInit(); // eslint-disable-line @angular-eslint/no-lifecycle-call

      component['scrollToTopContainer'].scrollEvent$.next(container);

      expect(component.containerScrolled).toEqual(true);
    });

    test('should set containerScrolled to false if the container is scrolled to less than 10px', () => {
      const container: HTMLElement = component['document'].createElement('div');
      container.scrollTop = 1;
      expect(component.containerScrolled).toEqual(undefined);

      component.ngOnInit(); // eslint-disable-line @angular-eslint/no-lifecycle-call

      component['scrollToTopContainer'].scrollEvent$.next(container);

      expect(component.containerScrolled).toEqual(false);
    });

    test('should not change containerScrolled if the scrollTop property is between 10 and 100', () => {
      const container: HTMLElement = component['document'].createElement('div');
      container.scrollTop = 50;
      expect(component.containerScrolled).toEqual(undefined);

      component.ngOnInit(); // eslint-disable-line @angular-eslint/no-lifecycle-call

      component['scrollToTopContainer'].scrollEvent$.next(container);

      expect(component.containerScrolled).toEqual(undefined);
    });
  });

  describe('onWindowScroll', () => {
    beforeEach(() => {
      component['document'].documentElement.scrollTop = undefined;
      component['document'].body.scrollTop = undefined;
    });

    test('should set windowScrolled to true', () => {
      component['document'].documentElement.scrollTop = 100;
      component['document'].body.scrollTop = 100;

      component.onWindowScroll();

      expect(component.containerScrolled).toBeTruthy();
    });

    test('should set windowScrolled to true', () => {
      component['document'].documentElement.scrollTop = 110;
      component['document'].body.scrollTop = 110;

      component.onWindowScroll();

      expect(component.containerScrolled).toBeTruthy();
    });

    test('should set windowScrolled on false', () => {
      component['document'].documentElement.scrollTop = 5;
      component['document'].body.scrollTop = 5;

      component.onWindowScroll();

      expect(component.containerScrolled).toBeFalsy();
    });

    test('should set windowScrolled on false', () => {
      component['document'].documentElement.scrollTop = 0;
      component['document'].documentElement.scrollTop = 0;

      component.onWindowScroll();

      expect(component.containerScrolled).toBeFalsy();
    });
  });

  describe('scrollToTop', () => {
    let spyScrollTo: jest.Mock;
    let spyRequestAnimation: jest.Mock;

    beforeEach(() => {
      spyScrollTo = jest.fn();
      Object.defineProperty(window, 'scrollTo', { value: spyScrollTo });

      spyRequestAnimation = jest.fn();
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: spyRequestAnimation,
      });
    });

    beforeEach(() => {
      component['document'].documentElement.scrollTop = undefined;
      component['document'].body.scrollTop = undefined;
    });

    test('should scroll container element to top', () => {
      Object.defineProperty(component, 'scrollToTopContainer', {
        value: new ScrollToTopDirective(
          new ElementRef(component['document'].createElement('div'))
        ),
      });

      component['scrollToTopContainer'].element.nativeElement.animate =
        () => {};
      component['scrollToTopContainer'].element.nativeElement.scrollTo =
        () => {};

      const spyAnimateContainer = jest.spyOn(
        component['scrollToTopContainer'].element.nativeElement,
        'animate'
      );
      const spyScrollToContainer = jest.spyOn(
        component['scrollToTopContainer'].element.nativeElement,
        'scrollTo'
      );

      component['scrollToTopContainer'].element.nativeElement.scrollTop = 500;

      component.scrollToTop();

      expect(spyScrollToContainer).toHaveBeenCalledWith({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      expect(spyAnimateContainer).toHaveBeenCalledWith(undefined, {
        duration: 200,
      });
    });

    test('should do nothing if container element is on top', () => {
      Object.defineProperty(component, 'scrollToTopContainer', {
        value: new ScrollToTopDirective(
          new ElementRef(component['document'].createElement('div'))
        ),
      });

      component['scrollToTopContainer'].element.nativeElement.animate =
        () => {};
      component['scrollToTopContainer'].element.nativeElement.scrollTo =
        () => {};

      const spyAnimateContainer = jest.spyOn(
        component['scrollToTopContainer'].element.nativeElement,
        'animate'
      );
      const spyScrollToContainer = jest.spyOn(
        component['scrollToTopContainer'].element.nativeElement,
        'scrollTo'
      );

      component['scrollToTopContainer'].element.nativeElement.scrollTop = 0;

      component.scrollToTop();

      expect(spyScrollToContainer).not.toHaveBeenCalled();
      expect(spyAnimateContainer).not.toHaveBeenCalled();
    });

    test('should not call native window methods', () => {
      component['document'].documentElement.scrollTop = 0;

      component.scrollToTop();

      expect(spyScrollTo).not.toHaveBeenCalled();
      expect(spyRequestAnimation).not.toHaveBeenCalled();
    });

    test('should not call native window methods', () => {
      component['document'].body.scrollTop = 0;

      component.scrollToTop();

      expect(spyScrollTo).not.toHaveBeenCalled();
      expect(spyRequestAnimation).not.toHaveBeenCalled();
    });

    test('should call native window methods', () => {
      component['document'].documentElement.scrollTop = 1000;

      component.scrollToTop();

      expect(spyScrollTo).toHaveBeenCalled();
      expect(spyRequestAnimation).toHaveBeenCalled();
    });
  });
});
