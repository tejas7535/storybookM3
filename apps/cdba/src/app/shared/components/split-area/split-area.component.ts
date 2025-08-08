import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'cdba-split-area',
  imports: [CommonModule, MatIcon, MatButtonModule],
  templateUrl: './split-area.component.html',
})
export class SplitAreaComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input()
  loadingTemplate: TemplateRef<any>;
  @Input()
  leftAreaTemplate: TemplateRef<any>;
  @Input()
  rightAreaTemplate: TemplateRef<any>;
  @Input()
  isLoading$: Observable<boolean>;
  @Input()
  minLeftAreaWidthPercent: number;
  @Input()
  maxLeftAreaWidthPercent: number;

  @ViewChild('wrapper') wrapper!: ElementRef<HTMLDivElement>;
  @ViewChild('leftArea') leftArea!: ElementRef<HTMLDivElement>;
  @ViewChild('separator') separator!: ElementRef<HTMLDivElement>;

  isDragDisabled = true;
  isDragging = false;

  isLoadingSubscription: Subscription;
  isLoading = false;

  separatorMiddle: number;

  defaultLeftAreaWidth: number;

  constructor(private readonly renderer: Renderer2) {}

  ngOnInit(): void {
    this.isLoadingSubscription = this.isLoading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });
  }

  ngOnDestroy(): void {
    this.isLoadingSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.isDragDisabled = false;

    if (!this.isLoading) {
      this.defaultLeftAreaWidth =
        (this.wrapper.nativeElement.clientWidth -
          this.separator.nativeElement.clientWidth) /
        2;

      this.renderer.setStyle(
        this.leftArea.nativeElement,
        'width',
        `${this.defaultLeftAreaWidth}px`
      );

      this.calculateSeparatorMiddlePosition();
    }
  }

  onDragStarted(): void {
    this.isDragging = true;
  }

  @HostListener('document:mouseup', ['$event'])
  onDragEnded() {
    this.isDragging = false;
  }

  @HostListener('document:mousemove', ['$event'])
  onDragMoved(event: MouseEvent): void {
    if (this.isDragging) {
      this.calculateSeparatorMiddlePosition();

      if (
        !(event.movementX > 0 && event.clientX < this.separatorMiddle) &&
        !(event.movementX < 0 && event.clientX > this.separatorMiddle)
      ) {
        const newAreaWidth = Math.max(
          100,
          this.leftArea.nativeElement.getBoundingClientRect().width +
            event.movementX
        );

        this.renderer.setStyle(
          this.leftArea.nativeElement,
          'width',
          `${newAreaWidth}px`
        );
      }
    }
  }

  onDragIconDoubleClick(): void {
    this.renderer.setStyle(
      this.leftArea.nativeElement,
      'width',
      `${this.defaultLeftAreaWidth}px`
    );
  }

  private calculateSeparatorMiddlePosition(): void {
    const separatorLeft = Math.abs(
      this.separator.nativeElement.getBoundingClientRect().x
    );
    const separatorRight =
      separatorLeft + this.separator.nativeElement.clientWidth;
    this.separatorMiddle = (separatorLeft + separatorRight) / 2;
  }
}
