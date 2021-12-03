import { ElementRef } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { InViewDirective } from './in-view.directive';

(window as any).IntersectionObserver = jest.fn();
IntersectionObserver.prototype.observe = jest.fn();
IntersectionObserver.prototype.disconnect = jest.fn();

const mockObserver: IntersectionObserver = {
  observe(): void {},
  root: undefined,
  rootMargin: '',
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  },
  thresholds: undefined,
  unobserve(): void {},
  disconnect: jest.fn(),
};

class MockElementRef extends ElementRef {
  nativeElement = {};
  constructor() {
    super(undefined);
  }
}

describe('InViewDirective', () => {
  let spectator: SpectatorDirective<InViewDirective>;
  let directive: InViewDirective;

  const createDirective = createDirectiveFactory({
    directive: InViewDirective,
    imports: [RouterTestingModule],
    providers: [{ provide: ElementRef, useClass: MockElementRef }],
  });

  beforeEach(() => {
    spectator = createDirective(`<div cdbaInView>Am I in View?</div>`);

    directive = spectator.directive;
    directive.observer = mockObserver;
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });

  it('should setup the observer', () => {
    directive.ngAfterViewInit();
    expect(directive.observer).toBeTruthy();
  });

  it('should stop the observer', () => {
    directive.ngOnDestroy();
    expect(directive.observer.disconnect).toHaveBeenCalled();
  });
});
