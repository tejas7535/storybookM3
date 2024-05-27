import { CdkOverlayOrigin, OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';

import { fromEvent, merge, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  startWith,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs/operators';

@Component({
  selector: 'mac-html-tooltip',
  templateUrl: './html-tooltip.component.html',
  standalone: true,
  imports: [CommonModule, OverlayModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HtmlTooltipComponent implements OnDestroy, OnInit {
  @Input() tooltipOrigin: CdkOverlayOrigin;
  @Input() tooltipShowDelay = 0;
  @Input() tooltipHideDelay = 0;
  @Input() tooltipOffsetY: number;

  @ViewChild('tooltip') tooltip: ElementRef;
  isOpened = false;
  fadeOut = false;
  destroy$ = new Subject<void>();

  elementMouseenter$: Observable<Event>;
  elementMouseleave$: Observable<Event>;
  documentMousemove$: Observable<Event>;

  cursorX: number;
  cursorY: number;

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    const element = this.tooltipOrigin.elementRef.nativeElement;
    this.elementMouseenter$ = fromEvent(element, 'mouseenter');
    this.elementMouseleave$ = fromEvent(element, 'mouseleave');
    this.documentMousemove$ = fromEvent(document, 'mousemove');

    this.elementMouseenter$
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !this.isOpened),
        switchMap((enterEvent: Event) =>
          merge(this.elementMouseleave$, this.documentMousemove$).pipe(
            startWith(enterEvent),
            debounceTime(this.tooltipShowDelay),
            filter(() => !this.isMovedOutside(this.tooltip))
          )
        )
      )
      .subscribe(() => {
        this.fadeOut = false;
        this.changeState(true);
      });

    merge(this.elementMouseleave$, this.documentMousemove$)
      .pipe(
        tap((event) => {
          this.cursorX = (event as MouseEvent).pageX;
          this.cursorY = (event as MouseEvent).pageY;
        }),
        takeUntil(this.destroy$),
        debounceTime(this.tooltipHideDelay),
        filter(() => this.isOpened),
        filter(() => this.isMovedOutside(this.tooltip))
      )
      .subscribe(() => {
        this.fadeOut = true;
        this.changeDetectorRef.markForCheck();
        setTimeout(() => {
          this.changeState(false);
        }, 500);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  connectedOverlayDetach() {
    setTimeout(() => this.changeState(false), 500);
  }

  private changeState(isOpened: boolean) {
    this.isOpened = isOpened;
    this.changeDetectorRef.markForCheck();
  }

  private isMovedOutside(tooltip: ElementRef): boolean {
    const elementRect: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    } = this.tooltipOrigin.elementRef.nativeElement.getBoundingClientRect();
    const tooltipRect: {
      left: number;
      right: number;
      top: number;
      bottom: number;
    } = tooltip?.nativeElement?.getBoundingClientRect();

    return !(
      this.isCursorOverRect(elementRect) || this.isCursorOverRect(tooltipRect)
    );
  }

  private isCursorOverRect(rect?: {
    left: number;
    right: number;
    top: number;
    bottom: number;
  }): boolean {
    if (!rect) {
      return false;
    }

    return (
      this.cursorX > rect.left &&
      this.cursorX < rect.right &&
      this.cursorY > rect.top &&
      this.cursorY < rect.bottom
    );
  }
}
