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

import { fromEvent, Observable, Subject } from 'rxjs';
import {
  debounceTime,
  filter,
  startWith,
  switchMap,
  takeUntil,
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

  constructor(private readonly changeDetectorRef: ChangeDetectorRef) {}

  ngOnInit(): void {
    const element = this.tooltipOrigin.elementRef.nativeElement;

    (fromEvent(element, 'mouseenter') as Observable<Event>)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => !this.isOpened),
        switchMap((enterEvent: Event) =>
          fromEvent(document, 'mousemove').pipe(
            startWith(enterEvent),
            debounceTime(this.tooltipShowDelay),
            filter(
              (event: Event) =>
                !this.isMovedOutside(element, this.tooltip, event)
            )
          )
        )
      )
      .subscribe(() => {
        this.fadeOut = false;
        this.changeState(true);
      });

    (fromEvent(document, 'mousemove') as Observable<Event>)
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(this.tooltipHideDelay),
        filter(() => this.isOpened),
        filter((event: Event) =>
          this.isMovedOutside(element, this.tooltip, event)
        )
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

  private isMovedOutside(
    element: any,
    tooltip: ElementRef,
    event: Event
  ): boolean {
    return !(
      element.contains(event['target']) ||
      tooltip?.nativeElement?.contains(event['target'])
    );
  }
}
