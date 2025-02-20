import { NgClass } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  input,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { CalculationResultPreviewItem } from '@ea/core/store/models';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationPreviewErrorsDialogComponent } from '../calculation-preview-errors-dialog/calculation-preview-errors-dialog.component';

@Component({
  selector: 'ea-calculation-result-preview-errors',
  templateUrl: './calculation-result-preview-errors.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SharedTranslocoModule,
    MatIconModule,
    MatDividerModule,
    MatSidenavModule,
    MatButtonModule,
    NgClass,
  ],
})
export class CalculationResultPreviewErrorsComponent
  implements AfterViewInit, OnDestroy
{
  @ViewChild('errorContainer') errorContainer!: ElementRef;

  errors = input.required<string[] | undefined>();
  downstreamErrors = input.required<string[]>();
  errorTitle = input.required<string>();

  combinedErrors = computed(() => {
    const combined = [];

    if (this.downstreamCalculationData().length > 0) {
      combined.push(...this.downstreamErrors());
    }

    if (this.catalogCalculationData().length > 0) {
      combined.push(...(this.errors() ?? []));
    }

    return combined.join(' ');
  });

  isOverflowing = false;

  overlayData = input.required<CalculationResultPreviewItem[]>();

  readonly downstreamItems = new Set(['emissions', 'frictionalPowerloss']);
  catalogCalculationData = computed(() =>
    this.overlayData().filter((item) => !this.downstreamItems.has(item.title))
  );

  downstreamCalculationData = computed(() =>
    this.overlayData().filter((item) => this.downstreamItems.has(item.title))
  );

  affectedHeaders = computed(() => {
    const items: CalculationResultPreviewItem[] = [];
    if (this.errors()?.length > 0) {
      items.push(...this.catalogCalculationData());
    }
    if (this.downstreamErrors().length > 0) {
      items.push(...this.downstreamCalculationData());
    }

    return items;
  });

  private resizeObserver!: ResizeObserver;

  private dialogRef: MatDialogRef<CalculationPreviewErrorsDialogComponent> | null =
    undefined;
  private mutationObserver!: MutationObserver;

  constructor(
    private readonly dialog: MatDialog,
    private readonly changeDetectionRef: ChangeDetectorRef
  ) {
    effect(() => {
      const catalogErrors = this.errors();
      if (catalogErrors && this.dialogRef) {
        this.dialogRef.componentInstance.catalogErrors = this.errors;
      }
    });
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver(() => {
      this.checkOverflow();
    });

    this.mutationObserver = new MutationObserver(() => {
      this.checkOverflow();
    });

    if (this.errorContainer) {
      this.resizeObserver.observe(this.errorContainer.nativeElement);
      this.mutationObserver.observe(this.errorContainer.nativeElement, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver && this.errorContainer) {
      this.resizeObserver.unobserve(this.errorContainer.nativeElement);
    }

    if (this.mutationObserver && this.errorContainer) {
      this.mutationObserver.disconnect();
    }
  }

  public showErrorsDialog() {
    this.dialogRef = this.dialog.open(CalculationPreviewErrorsDialogComponent, {
      hasBackdrop: true,
      autoFocus: true,
      panelClass: 'calculation-errors-dialog',
      maxWidth: '750px',
      data: {
        title: this.errorTitle(),
        downstreamPreviewItems: this.downstreamCalculationData(),
        downstreamErrors: this.downstreamErrors(),
        catalogPreviewItems: this.catalogCalculationData(),
        catalogErrors: this.errors() ?? [],
      },
    });
  }

  checkOverflow() {
    const element = this.errorContainer?.nativeElement;
    this.isOverflowing = element
      ? element.scrollHeight > element.clientHeight
      : false;

    this.changeDetectionRef.detectChanges();
  }
}
