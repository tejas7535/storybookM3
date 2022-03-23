import { ElementRef } from '@angular/core';

import {
  createDirectiveFactory,
  SpectatorDirective,
} from '@ngneat/spectator/jest';

import { ResizableWidthDirective } from './resizable-width.directive';

class MockElementRef extends ElementRef {
  nativeElement = {};
  constructor() {
    super(undefined);
  }
}

describe('ResizableWidthDirective', () => {
  let spectator: SpectatorDirective<ResizableWidthDirective>;
  let directive: ResizableWidthDirective;

  const createDirective = createDirectiveFactory({
    directive: ResizableWidthDirective,
    providers: [{ provide: ElementRef, useClass: MockElementRef }],
  });

  beforeEach(() => {
    spectator = createDirective(
      `<div><div cdbaResizableWidth>I am resizable!</div></div>`
    );

    directive = spectator.directive;
  });

  it('should be created', () => {
    expect(directive).toBeTruthy();
  });
});
