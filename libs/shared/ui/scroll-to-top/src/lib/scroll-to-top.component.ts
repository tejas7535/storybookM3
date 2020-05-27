import { DOCUMENT } from '@angular/common';
import {
  Component,
  Host,
  HostListener,
  Inject,
  OnInit,
  Optional,
} from '@angular/core';

import { scrollToTopAnimations } from './scroll-to-top.animations';
import { ScrollToTopDirective } from './scroll-to-top.directive';

/** @dynamic */
@Component({
  selector: 'schaeffler-scroll-to-top',
  templateUrl: './scroll-to-top.component.html',
  styleUrls: ['./scroll-to-top.component.scss'],
  animations: scrollToTopAnimations,
})
export class ScrollToTopComponent implements OnInit {
  public containerScrolled: boolean;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    @Optional()
    @Host()
    private readonly scrollToTopContainer: ScrollToTopDirective // tslint:disable-line:prefer-inline-decorator
  ) {}

  ngOnInit(): void {
    if (this.scrollToTopContainer) {
      this.scrollToTopContainer.scrollEvent$.subscribe((container) => {
        if (container.scrollTop && container.scrollTop >= 100) {
          this.containerScrolled = true;
        } else if (container.scrollTop && container.scrollTop < 10) {
          this.containerScrolled = false;
        }
      });
    }
  }

  /**
   * host listener, which listens to scrolling events
   */
  @HostListener('window:scroll', []) public onWindowScroll(): void {
    if (!this.scrollToTopContainer) {
      if (
        window.pageYOffset ||
        (this.document.documentElement.scrollTop &&
          this.document.body.scrollTop >= 100)
      ) {
        this.containerScrolled = true;
      } else if (
        this.document.documentElement.scrollTop &&
        this.document.body.scrollTop < 10
      ) {
        this.containerScrolled = false;
      }
    }
  }

  /**
   * scrolls smoothly to top of the page
   */
  public scrollToTop = (): void => {
    if (this.scrollToTopContainer) {
      const currentScroll = this.scrollToTopContainer.element.nativeElement
        .scrollTop;
      if (currentScroll > 0) {
        this.scrollToTopContainer.element.nativeElement.animate(
          this.scrollToTopContainer.element.nativeElement.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
          }),
          {
            duration: 200,
          }
        );
      }
    } else {
      const currentScroll =
        this.document.documentElement.scrollTop || this.document.body.scrollTop;
      if (currentScroll > 0) {
        window.requestAnimationFrame(this.scrollToTop);
        window.scrollTo(0, currentScroll - currentScroll / 8);
      }
    }
  }; // tslint:disable-line:semicolon
}
