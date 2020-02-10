import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, Host, Inject, Optional } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { ScrollToTopDirective } from './scroll-to-top.directive';

@Component({
  template: '<div></div>'
})
class TestScrollToTopComponent {
  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional() @Host() public directive: ScrollToTopDirective
  ) {}
}

describe('ScrollToTopDirective', () => {
  let component: TestScrollToTopComponent;
  let fixture: ComponentFixture<TestScrollToTopComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [TestScrollToTopComponent, ScrollToTopDirective]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestScrollToTopComponent);
    component = fixture.componentInstance;
    component.directive = new ScrollToTopDirective(
      new ElementRef(component['document'].createElement('div'))
    );
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onScroll', () => {
    test('should pass target element of scroll event', () => {
      const spy = jest.spyOn(component.directive.scrollEvent$, 'next');

      const target: HTMLElement = component['document'].createElement('div');

      component.directive.onScroll(({ target } as unknown) as Event);

      expect(spy).toHaveBeenCalledWith(target);
    });
  });
});
