import { ElementRef } from '@angular/core';

import { isTextTruncatedDirective } from './show-tooltip-when-truncated.directive';

describe('isTextTruncatedDirective', () => {
  it('should create an instance', () => {
    const directive = new isTextTruncatedDirective({} as ElementRef);
    expect(directive).toBeTruthy();
  });

  test('should set isTruncated to true for truncated text', () => {
    const directive = new isTextTruncatedDirective({
      nativeElement: { offsetWidth: 200, scrollWidth: 300 },
    } as ElementRef);

    directive.onMouseEnter();

    expect(directive.isTruncated).toEqual(true);
  });

  test('should set isTruncated to false for non-truncated text', () => {
    const directive = new isTextTruncatedDirective({
      nativeElement: { offsetWidth: 400, scrollWidth: 300 },
    } as ElementRef);

    directive.onMouseEnter();

    expect(directive.isTruncated).toEqual(false);
  });
});
