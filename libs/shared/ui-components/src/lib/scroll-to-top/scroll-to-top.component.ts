import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject } from '@angular/core';

import { scrollToTopAnimations } from './scroll-to-top.animations';

/** @dynamic */
@Component({
  selector: 'schaeffler-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  animations: scrollToTopAnimations
})
export class ScrollToTopComponent {
  public windowScrolled: boolean;

  constructor(@Inject(DOCUMENT) private readonly document: Document) {}

  /**
   * host listener, which listens to scrolling events
   */
  @HostListener('window:scroll', []) public onWindowScroll(): void {
    if (
      window.pageYOffset ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop > 100
    ) {
      this.windowScrolled = true;
    } else if (
      (this.windowScrolled && window.pageYOffset) ||
      this.document.documentElement.scrollTop ||
      this.document.body.scrollTop < 10
    ) {
      this.windowScrolled = false;
    }
  }

  /**
   * scrolls smoothly to top of the page
   */
  public scrollToTop = (): void => {
    const currentScroll =
      this.document.documentElement.scrollTop || this.document.body.scrollTop;

    if (currentScroll > 0) {
      window.requestAnimationFrame(this.scrollToTop);
      window.scrollTo(0, currentScroll - currentScroll / 8);
    }
  }; // tslint:disable-line:semicolon
}
