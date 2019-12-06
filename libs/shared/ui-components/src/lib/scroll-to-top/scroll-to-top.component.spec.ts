import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { configureTestSuite } from 'ng-bullet';

import { ScrollToTopComponent } from './scroll-to-top.component';

describe('ScrollToTopComponent', () => {
  let component: ScrollToTopComponent;
  let fixture: ComponentFixture<ScrollToTopComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, NoopAnimationsModule],
      declarations: [ScrollToTopComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScrollToTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onWindowScroll', () => {
    beforeEach(() => {
      component['document'].documentElement.scrollTop = undefined;
      component['document'].body.scrollTop = undefined;
    });

    test('should set windowScrolled to true', () => {
      component['document'].documentElement.scrollTop = 100;

      component.onWindowScroll();

      expect(component.windowScrolled).toBeTruthy();
    });

    test('should set windowScrolled to true', () => {
      component['document'].body.scrollTop = 110;

      component.onWindowScroll();

      expect(component.windowScrolled).toBeTruthy();
    });

    test('should set windowScrolled on false', () => {
      component['document'].body.scrollTop = 5;

      component.onWindowScroll();

      expect(component.windowScrolled).toBeFalsy();
    });

    test('should set windowScrolled on false', () => {
      component['document'].documentElement.scrollTop = 0;

      component.onWindowScroll();

      expect(component.windowScrolled).toBeFalsy();
    });
  });

  describe('scrollToTop', () => {
    let spyScrollTo;
    let spyRequestAnimation;

    beforeEach(() => {
      spyScrollTo = jest.fn();
      Object.defineProperty(window, 'scrollTo', { value: spyScrollTo });

      spyRequestAnimation = jest.fn();
      Object.defineProperty(window, 'requestAnimationFrame', {
        value: spyRequestAnimation
      });
    });

    beforeEach(() => {
      component['document'].documentElement.scrollTop = undefined;
      component['document'].body.scrollTop = undefined;
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
