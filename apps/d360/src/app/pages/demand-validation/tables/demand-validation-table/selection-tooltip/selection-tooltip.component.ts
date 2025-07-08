import { CommonModule, DOCUMENT } from '@angular/common';
import {
  Component,
  computed,
  ElementRef,
  HostBinding,
  inject,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { fromEvent, tap } from 'rxjs';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { AgColumn, CellSelectionChangedEvent } from 'ag-grid-enterprise';

import { SharedTranslocoModule } from '@schaeffler/transloco';

interface PositionParams {
  firstElementInRow: DOMRect;
  lastSelectedElement: AgColumn;
  scrollContainer: DOMRect;
  table: DOMRect;
  tooltip: DOMRect;
  event: CellSelectionChangedEvent;
}

@Component({
  selector: 'd360-selection-tooltip',
  imports: [CommonModule, SharedTranslocoModule],
  templateUrl: './selection-tooltip.component.html',
  styleUrls: ['./selection-tooltip.component.scss'],
})
export class SelectionTooltipComponent {
  protected readonly localeService: TranslocoLocaleService = inject(
    TranslocoLocaleService
  );

  public visible: WritableSignal<boolean> = signal(false);
  public position: WritableSignal<{ x: number; y: number }> = signal({
    x: 0,
    y: 0,
  });
  public stats: WritableSignal<{
    sum: number;
    average: number;
    count: number;
    min: number;
    max: number;
  }> = signal({ sum: 0, average: 0, count: 0, min: 0, max: 0 });

  private readonly document = inject(DOCUMENT);
  private readonly tooltip: ElementRef = inject(ElementRef);

  private readonly backupDimensions: { width: number; height: number } = {
    width: 140,
    height: 110,
  };

  @HostBinding('style.left') protected get left(): string {
    return `${this.position().x}px`;
  }
  @HostBinding('style.top') protected get top(): string {
    return `${this.position().y}px`;
  }
  @HostBinding('style.display') protected get display(): string {
    return this.visible() ? 'block' : 'none';
  }

  protected statsToShow: Signal<{ label: string; value: string }[]> = computed(
    () => [
      { label: 'selectionTooltip.sum', value: this.format(this.stats().sum) },
      {
        label: 'selectionTooltip.average',
        value: this.format(this.stats().average),
      },
      {
        label: 'selectionTooltip.count',
        value: this.format(this.stats().count),
      },
      { label: 'selectionTooltip.min', value: this.format(this.stats().min) },
      { label: 'selectionTooltip.max', value: this.format(this.stats().max) },
    ]
  );

  public constructor() {
    fromEvent(this.document, 'click')
      .pipe(
        tap(() => this.visible.set(false)),
        takeUntilDestroyed()
      )
      .subscribe();
  }

  public open(
    event: CellSelectionChangedEvent,
    table: DOMRect,
    scrollContainer: DOMRect
  ): void {
    const ranges = event.api.getCellRanges();
    if (!ranges || ranges.length === 0) {
      this.visible.set(false);

      return;
    }

    const range = ranges[0];
    const startRowIndex = range.startRow?.rowIndex;
    const endRowIndex = range.endRow?.rowIndex;

    // Ensure horizontal selection
    if (startRowIndex !== endRowIndex) {
      this.visible.set(false);

      event.api.clearCellSelection();
      event.api.addCellRange({
        rowStartIndex: startRowIndex,
        rowEndIndex: startRowIndex,
        columns: range.columns.map((col: any) => col.getColId()),
      });

      return;
    }

    // Get numeric selected cells
    const numericCells = range.columns
      .map((col: any) =>
        event.api.getCellValue({
          rowNode: event.api.getDisplayedRowAtIndex(startRowIndex),
          colKey: col.getColId(),
        })
      )
      // Filter out invalid cells (e.g., non-numeric values)
      .filter((value: any) => typeof value === 'number');

    // only proceed if there are at least two numeric cells
    if (numericCells.length <= 1) {
      this.visible.set(false);

      return;
    }

    // Calculate statistics
    const sum = numericCells.reduce((a: number, b: number) => a + b, 0);
    const average = sum / numericCells.length;
    const count = numericCells.length;
    const min = Math.min(...numericCells);
    const max = Math.max(...numericCells);

    // Update tooltip
    const lastSelectedElement = range.columns.at(-1) as AgColumn;
    if (lastSelectedElement) {
      const firstElementInRow = (
        event.api.getCellRendererInstances({
          rowNodes: [event.api.getDisplayedRowAtIndex(startRowIndex)],
        })?.[0] as any
      )?.parameters?.eGridCell?.getBoundingClientRect();

      this.position.set(
        this.calculatePosition({
          firstElementInRow,
          lastSelectedElement,
          scrollContainer,
          table,
          event,
          tooltip: this.tooltip.nativeElement.getBoundingClientRect(),
        })
      );
      this.stats.set({ sum, average, count, min, max });
      this.visible.set(true);
    }
  }

  protected format(value: number): string {
    return this.localeService.localizeNumber(
      value,
      'decimal',
      this.localeService.getLocale(),
      { minimumFractionDigits: 0, maximumFractionDigits: 0 }
    );
  }

  private calculatePosition({
    firstElementInRow,
    lastSelectedElement,
    scrollContainer,
    table,
    event,
    tooltip,
  }: PositionParams): { x: number; y: number } {
    const toolTipWidth = tooltip.width || this.backupDimensions.width;
    const toolTipHeight = tooltip.height || this.backupDimensions.height;
    const {
      width: firstElWidth,
      top: firstElTop,
      height: firstElHeight,
    } = firstElementInRow;
    const lastElLeft = lastSelectedElement['left'];
    const lastElWidth = lastSelectedElement['actualWidth'];
    const tableTop = table.top;
    const horizontalScrollOffset = event.api.getHorizontalPixelRange().left;

    // Calculate x position - place after the last selected element
    let x =
      firstElWidth +
      lastElLeft +
      (lastElWidth - toolTipWidth) -
      horizontalScrollOffset;

    // Calculate y position - directly above the row
    let y = firstElTop - tableTop - toolTipHeight / 2 - 10;

    // Adjust for right boundary overflow
    const rightEdge = scrollContainer.width + firstElWidth;
    if (x + toolTipWidth > rightEdge) {
      x = rightEdge - toolTipWidth;
    }

    // Adjust for top boundary overflow - position below the row instead
    if (y < 0) {
      y = firstElHeight + firstElTop - tableTop + toolTipHeight / 2;
    }

    return { x, y };
  }
}
