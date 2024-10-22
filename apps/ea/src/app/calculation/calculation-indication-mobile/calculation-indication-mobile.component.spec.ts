import { Renderer2 } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';
import {
  MatProgressBar,
  MatProgressBarModule,
} from '@angular/material/progress-bar';

import { createComponentFactory, Spectator } from '@ngneat/spectator/jest';

import { CalculationIndicationMobileComponent } from './calculation-indication-mobile.component';

describe('CalculationIndicationMobileComponent', () => {
  let spectator: Spectator<CalculationIndicationMobileComponent>;
  let component: CalculationIndicationMobileComponent;
  let renderer2Mock: Renderer2;
  const createComponent = createComponentFactory({
    component: CalculationIndicationMobileComponent,
    imports: [MatProgressBarModule],
    providers: [Renderer2],
  });

  beforeEach(() => {
    Object.defineProperty(window, 'visualViewport', {
      value: {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
        height: 400,
        offsetTop: 0,
      },
      writable: true,
    });

    Object.defineProperty(window, 'innerHeight', {
      value: 800,
      writable: true,
    });

    spectator = createComponent();
    component = spectator.component;
    renderer2Mock = spectator.inject(Renderer2, true);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show indeterminate progress bard when isCalculationLoading is true', () => {
    spectator.setInput('isCalculationLoading', true);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeTruthy();
    expect(progressBar.mode).toBe('indeterminate');
  });

  it('should not show progress bars', () => {
    spectator.setInput('isCalculationLoading', false);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeFalsy();
  });

  it('should show progress bar when isCalculationResultAvailable is true', () => {
    spectator.setInput('isCalculationResultAvailable', true);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeTruthy();
    expect(progressBar.mode).toBe('determinate');
    expect(progressBar.value).toBe(100);
  });

  it('should not show progress bar when isCalculationResultAvailable is false', () => {
    spectator.setInput('isCalculationResultAvailable', false);
    const progressBar = spectator.query(MatProgressBar);

    expect(progressBar).toBeFalsy();
  });

  describe('on mobile web platform', () => {
    beforeEach(() => {
      Object.defineProperty(navigator, 'userAgent', {
        value:
          'Mozilla/5.0 (Linux; Android 10; SM-G960U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.181 Mobile Safari/537.36',
      });
    });

    describe('ngOnInit', () => {
      it('should initialize web listeners', () => {
        const listenSpy = jest.spyOn(renderer2Mock, 'listen');

        component.ngOnInit();

        expect(listenSpy).toHaveBeenCalledWith(
          window.visualViewport,
          'resize',
          component['updatePosition']
        );

        expect(listenSpy).toHaveBeenCalledWith(
          window,
          'keydown',
          component['updatePositionWithDelay']
        );
        expect(listenSpy).toHaveBeenCalledWith(
          window.visualViewport,
          'scroll',
          component['updatePosition']
        );
      });

      it('should callculate keyboard height', () => {
        const element: HTMLElement = document.createElement('div');
        element.className = 'loading-spinner-wrapper';
        document.body.append(element);
        component.ngOnInit();
        const fixedElement: HTMLElement = document.querySelector(
          '.loading-spinner-wrapper'
        );

        expect(fixedElement.style.bottom).toBe('400px');

        element.remove();
      });

      it('should not calculate keyboard height when element does not exist', () => {
        const fixedElement: HTMLElement = document.querySelector(
          '.loading-spinner-wrapper'
        );

        expect(fixedElement).toBeFalsy();
      });

      it('should call updatePosition after a delay', fakeAsync(() => {
        jest.spyOn(component, 'updatePosition');
        component.updatePositionWithDelay();
        tick(500); // Simulate the passage of 500 milliseconds
        expect(component.updatePosition).toHaveBeenCalled();
      }));
    });
  });
});
