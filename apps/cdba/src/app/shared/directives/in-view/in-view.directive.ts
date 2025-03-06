import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[cdbaInView]',
  standalone: false,
})
export class InViewDirective implements AfterViewInit, OnDestroy {
  observer: IntersectionObserver;
  cssClassInView = 'in-view';
  cssClassNotInView = 'not-in-view';

  constructor(
    private readonly elementRef: ElementRef<HTMLElement>,
    private readonly renderer: Renderer2
  ) {}

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => this.setCssClass(entry.intersectionRatio > 0));
    });
    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private setCssClass(isInView: boolean): void {
    this.resetClasses();

    this.renderer.addClass(
      this.elementRef.nativeElement,
      isInView ? this.cssClassInView : this.cssClassNotInView
    );
  }

  private resetClasses(): void {
    this.renderer.removeClass(
      this.elementRef.nativeElement,
      this.cssClassNotInView
    );
    this.renderer.removeClass(
      this.elementRef.nativeElement,
      this.cssClassInView
    );
  }
}
