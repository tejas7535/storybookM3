import { Directive, ElementRef, OnDestroy, output } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[contentSwipe]',
  standalone: true,
})
export class CalculationDowstreamSwipeDirective implements OnDestroy {
  swipeLeft = output();
  swipeRight = output();

  private touchStartX: number;

  constructor(private readonly el: ElementRef) {
    this.el.nativeElement.addEventListener(
      'touchstart',
      this.onTouchStart.bind(this),
      { passive: true }
    );

    this.el.nativeElement.addEventListener(
      'touchend',
      this.onTouchEnd.bind(this),
      { passive: true }
    );
  }

  ngOnDestroy(): void {
    this.el.nativeElement.removeEventListener('touchstart', this.onTouchStart);
    this.el.nativeElement.removeEventListener('touchend', this.onTouchEnd);
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
  }

  onTouchEnd(event: TouchEvent): void {
    const deltaX = event.changedTouches[0].clientX - this.touchStartX;
    const swipeThreshold = 30; // Minimum swipe distance in pixels

    if (Math.abs(deltaX) > swipeThreshold) {
      if (deltaX < 0) {
        this.swipeRight.emit();
      } else {
        this.swipeLeft.emit();
      }
    }
  }
}
