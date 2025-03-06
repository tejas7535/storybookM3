import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[isTextTruncated]',
  exportAs: 'isTextTruncated',
  standalone: false,
})
export class isTextTruncatedDirective {
  isTruncated = true;

  constructor(private readonly elementRef: ElementRef) {}

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.checkIfTruncated();
  }

  private checkIfTruncated() {
    const element = this.elementRef.nativeElement;
    this.isTruncated = element.offsetWidth < element.scrollWidth ? true : false;
  }
}
