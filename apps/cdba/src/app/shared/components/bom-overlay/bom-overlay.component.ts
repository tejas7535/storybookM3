import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'cdba-bom-overlay',
  templateUrl: './bom-overlay.component.html',
  styleUrls: ['./bom-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomOverlayComponent implements OnInit, OnDestroy {
  @Output()
  private readonly closeOverlay: EventEmitter<void> = new EventEmitter();

  private readonly htmlElement: HTMLElement;
  private width: number;
  private observer: ResizeObserver;

  constructor(private readonly elementRef: ElementRef) {
    this.htmlElement = this.elementRef.nativeElement;
  }

  public ngOnInit(): void {
    this.observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      this.adjustWidth(width);
    });

    this.observer.observe(this.htmlElement);
  }

  public ngOnDestroy(): void {
    if (this.observer) {
      this.observer.unobserve(this.htmlElement);
    }
  }

  public onClose(): void {
    this.closeOverlay.emit();
  }

  private adjustWidth(width: number): void {
    if (this.width !== width) {
      this.width = width;

      // dispatch resize event to force an alignment update of tabs "inkBar" (active tab indicator)
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 5);
    }
  }
}
