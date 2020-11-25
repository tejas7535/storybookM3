import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';

import { Subject } from 'rxjs';

@Directive({
  selector: '[schaefflerScrollToTop]',
})
export class ScrollToTopDirective {
  public readonly scrollEvent$: Subject<HTMLElement> = new Subject<HTMLElement>();

  @HostBinding('style.height') public readonly height = '100%';
  @HostBinding('style.min-height') public readonly minHeight = '100%';
  @HostBinding('style.display') public readonly display = 'flex';
  @HostBinding('style.flex-direction') public readonly flexDirection = 'column';
  @HostBinding('style.overflow') public readonly overflow = 'auto';
  @HostBinding('attr.data-cy') public readonly dataCy = 'scrollToTopContainer';

  @HostListener('scroll', ['$event']) onScroll = (event: Event) => {
    this.scrollEvent$.next(event.target as HTMLElement);
  };

  constructor(public readonly element: ElementRef) {}
}
