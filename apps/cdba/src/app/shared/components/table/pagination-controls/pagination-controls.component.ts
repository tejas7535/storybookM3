import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs/internal/Subscription';

import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-enterprise';

import { getPaginationState, updatePaginationState } from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import {
  PAGE_SIZE_OPTIONS,
  PAGINATION_LOADING_TIMEOUT,
  PaginationType,
} from '@cdba/shared/constants/pagination';

import { PaginationControlsService } from './service/pagination-controls.service';

@Component({
  selector: 'cdba-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
  standalone: false,
})
export class PaginationControlsComponent implements OnInit, OnDestroy {
  @Input()
  gridApi: GridApi;

  readonly paginationType = PaginationType;

  pageSizeOptions = PAGE_SIZE_OPTIONS;

  paginationState: PaginationState;
  paginationState$ = this.store.select(getPaginationState);
  paginationStateSubscription: Subscription = new Subscription();

  constructor(
    public readonly paginationControlsService: PaginationControlsService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.paginationStateSubscription = this.paginationState$.subscribe(
      (state: PaginationState) => {
        this.paginationState = state;
      }
    );
  }

  ngOnDestroy(): void {
    this.paginationStateSubscription.unsubscribe();
  }

  onPageSizeChange(pageSizeOption: number): void {
    this.paginationControlsService.disablePagination();
    this.gridApi.setGridOption('loading', true);

    this.paginationControlsService.setPageSizeToLocalStorage(pageSizeOption);

    // Without timeout AG Grid cannot render the loading overlay
    setTimeout(() => {
      this.gridApi.updateGridOptions({
        paginationPageSize: pageSizeOption,
      });

      const currentPage = this.gridApi.paginationGetCurrentPage();

      const indexes = this.paginationControlsService.calculateRangeIndexes(
        currentPage,
        pageSizeOption,
        this.paginationState.totalRange
      );

      this.store.dispatch(
        updatePaginationState({
          paginationState: {
            ...this.paginationState,
            isEnabled: true,
            pageSize: pageSizeOption,
            currentPage,
            totalPages: this.gridApi.paginationGetTotalPages(),
            currentRangeStartIndex: indexes.currentRangeStartIndex,
            currentRangeEndIndex: indexes.currentRangeEndIndex,
          } as PaginationState,
        })
      );

      this.gridApi.setGridOption('loading', false);
    }, PAGINATION_LOADING_TIMEOUT);
  }

  onPageChange(paginationType: PaginationType): void {
    this.paginationControlsService.disablePagination();
    this.gridApi.setGridOption('loading', true);

    // Without timeout AG Grid cannot render the loading overlay
    setTimeout(() => {
      switch (paginationType) {
        case PaginationType.FIRST: {
          this.gridApi.paginationGoToFirstPage();
          break;
        }
        case PaginationType.LAST: {
          this.gridApi.paginationGoToLastPage();
          break;
        }
        case PaginationType.NEXT: {
          this.gridApi.paginationGoToNextPage();
          break;
        }
        case PaginationType.PREVIOUS: {
          this.gridApi.paginationGoToPreviousPage();
          break;
        }
        default: {
          throw new Error(`Unhandled pagination event type: ${paginationType}`);
        }
      }

      const currentPage = this.gridApi.paginationGetCurrentPage();

      const indexes = this.paginationControlsService.calculateRangeIndexes(
        currentPage,
        this.paginationState.pageSize,
        this.paginationState.totalRange
      );

      this.store.dispatch(
        updatePaginationState({
          paginationState: {
            ...this.paginationState,
            isEnabled: true,
            currentPage,
            totalPages: this.gridApi.paginationGetTotalPages(),
            currentRangeStartIndex: indexes.currentRangeStartIndex,
            currentRangeEndIndex: indexes.currentRangeEndIndex,
          } as PaginationState,
        })
      );

      this.gridApi.setGridOption('loading', false);
    }, PAGINATION_LOADING_TIMEOUT);
  }
}
