import {
  CollectionViewer,
  DataSource,
  ListRange,
} from '@angular/cdk/collections';
import { DestroyRef, inject, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

import { BehaviorSubject, EMPTY, Observable, Subscription } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { BackendTableResponse } from '../../../../shared/components/table';
import {
  Comment,
  CommentKeys,
  Sort,
} from '../../../../shared/models/comments.model';
import { SalesPlanningService } from './../../../../feature/sales-planning/sales-planning.service';

@Injectable()
export class CommentsDataSourceService extends DataSource<Comment | undefined> {
  private readonly salesPlanningService: SalesPlanningService =
    inject(SalesPlanningService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  private readonly dialogData: { customerNumber: string } =
    inject(MAT_DIALOG_DATA);
  private readonly pageSize = 50;

  public length = 0;
  public allData: (Comment | undefined)[] = [];

  private readonly fetched = new Set<number>();
  private readonly stream$ = new BehaviorSubject<(Comment | undefined)[]>([]);
  private readonly subscription = new Subscription();
  public readonly scrollingNeeded$ = new BehaviorSubject<boolean>(false);
  public readonly loaded$ = new BehaviorSubject<boolean>(false);
  public readonly secondLoadNeeded$: BehaviorSubject<boolean | null> =
    new BehaviorSubject<boolean | null>(null);
  public readonly secondLoaded$: BehaviorSubject<boolean | null> =
    new BehaviorSubject<boolean | null>(null);

  public connect(
    collectionViewer: CollectionViewer
  ): Observable<(Comment | undefined)[]> {
    // Initialize with a fetch to get the first page
    this.fetchPage(0);

    this.subscription.add(
      collectionViewer.viewChange.subscribe((range: ListRange) => {
        if (this.length > 0) {
          const startPage = this.getPageForIndex(range.start);
          const endPage = this.getPageForIndex(range.end - 1);

          for (let i = startPage; i <= endPage; i += 1) {
            this.fetchPage(i);
          }
        } else {
          // If we don't know the length yet, just fetch the first page to get the correct length.
          this.fetchPage(0);
        }
      })
    );

    return this.stream$;
  }

  public disconnect(): void {
    this.subscription.unsubscribe();
  }

  public refreshLastPage(newLength: number): void {
    this.length = newLength;

    // Get the last page index
    const lastPage = this.getPageForIndex(this.length - 1);
    this.fetched.delete(lastPage);

    // Fetch the last page again to refresh it
    this.fetchPage(lastPage, true);
  }

  private getPageForIndex(index: number): number {
    return Math.floor(index / this.pageSize);
  }

  private fetchPage(page: number, refresh: boolean = false): void {
    // If the page has already been fetched, skip it
    if (this.fetched.has(page)) {
      return;
    }

    // Mark the page as fetched
    this.fetched.add(page);

    this.salesPlanningService
      .getComments$({
        startRow: page * this.pageSize,
        endRow: (page + 1) * this.pageSize,
        sortModel: [{ colId: CommentKeys.CREATED_AT, sort: Sort.ASC }],
        selectionFilters: { customerNumber: [this.dialogData.customerNumber] },
      })
      .pipe(
        tap((result: BackendTableResponse<Comment>) => {
          if (this.length === 0) {
            this.length = result?.rowCount;

            this.secondLoadNeeded$.next(this.length > this.pageSize);

            this.allData = Array.from({ length: this.length }).fill(
              undefined as any
            ) as any;
          }

          // Insert data at the correct positions
          for (let i = 0; i < result?.rows.length; i += 1) {
            const row = result?.rows[i];
            const index = page * this.pageSize + i;

            if (index < this.length) {
              this.allData[index] = row;
            }
          }

          // Emit the reversed data
          this.stream$.next(this.allData);

          // Notify that data was loaded
          if (refresh) {
            this.scrollingNeeded$.next(true);
          } else if (this.secondLoadNeeded$.getValue()) {
            if (page === 0) {
              this.loaded$.next(false);
              this.secondLoaded$.next(false);
            } else {
              this.loaded$.next(true);
              this.secondLoaded$.next(true);
              this.secondLoadNeeded$.next(null);
            }
          } else {
            this.loaded$.next(true);
          }
        }),
        catchError(() => {
          // If an error occurs, we remove the page from the fetched set
          this.fetched.delete(page);

          return EMPTY;
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
