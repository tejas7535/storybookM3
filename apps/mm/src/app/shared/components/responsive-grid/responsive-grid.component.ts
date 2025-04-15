/* eslint-disable @typescript-eslint/member-ordering */
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ContentChild,
  inject,
  input,
  TemplateRef,
  TrackByFunction,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatDividerModule } from '@angular/material/divider';

import { map } from 'rxjs';

@Component({
  selector: 'mm-responsive-grid',
  templateUrl: './responsive-grid.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, MatDividerModule],
})
export class ResponsiveGridComponent<T> {
  items = input.required<T[]>();
  maxColumns = input<number>(4);
  trackBy = input<TrackByFunction<T>>((_index, item) => item);

  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;

  private readonly breakpointObserver = inject(BreakpointObserver);

  private readonly breakpoints = toSignal(
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
      ])
      .pipe(map(this.mapBreakpoints)),
    {
      initialValue: {
        isXSmall: false,
        isSmall: false,
        isMedium: false,
        isLarge: false,
      },
    }
  );

  columns = computed(() => {
    const bp = this.breakpoints();
    if (bp.isXSmall) {
      return 1;
    }
    if (bp.isSmall) {
      return 2;
    }
    if (bp.isMedium) {
      return 3;
    }

    return this.maxColumns();
  });

  gridClass = computed(() => {
    const itemCount = this.items().length;
    const baseClass = 'grid gap-2';
    const maxColsByScreenSize = this.columns();
    const actualCols = Math.min(itemCount, maxColsByScreenSize);

    const classMap: Record<number, string> = {
      1: `${baseClass} grid-cols-1`,
      2: `${baseClass} grid-cols-1 sm:grid-cols-2`,
      3: `${baseClass} grid-cols-1 sm:grid-cols-2 md:grid-cols-3`,
      4: `${baseClass} grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`,
    };

    return classMap[actualCols] || classMap[4];
  });

  shouldShowDivider = (index: number, isLast: boolean) => {
    if (isLast) {
      return false;
    }

    return (index + 1) % this.columns() !== 0;
  };

  isEndOfRow(index: number): boolean {
    const isLastItem = index === this.items().length - 1;
    const isRowEnd = (index + 1) % this.columns() === 0;

    return isRowEnd || isLastItem;
  }

  isLastRow(index: number): boolean {
    const totalItems = this.items().length;
    const cols = this.columns();
    const itemsInLastRow = totalItems % cols || cols;

    return index >= totalItems - itemsInLastRow;
  }

  trackItem(index: number, item: T): any {
    return this.trackBy()(index, item);
  }

  private mapBreakpoints(result: any) {
    return {
      isXSmall: result.breakpoints[Breakpoints.XSmall],
      isSmall: result.breakpoints[Breakpoints.Small],
      isMedium: result.breakpoints[Breakpoints.Medium],
      isLarge: result.breakpoints[Breakpoints.Large],
    };
  }
}
