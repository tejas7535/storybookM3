import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Observable } from 'rxjs/internal/Observable';

import { Store } from '@ngrx/store';
import { GridApi } from 'ag-grid-community';

import { getPaginationVisibility } from '@cdba/core/store';
import {
  MIN_PAGE_SIZE,
  PAGE_SIZE_OPTIONS,
  PAGINATION_LOADING_TIMEOUT,
  PaginationType,
} from '@cdba/shared/constants/pagination';

import { PaginationControlsService } from './service/pagination-controls.service';

@Component({
  selector: 'cdba-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss'],
})
export class PaginationControlsComponent implements OnInit, OnDestroy {
  @Input()
  gridApi: GridApi;

  disabled = false;
  readonly paginationType = PaginationType;

  pageSize: number;
  pageSizeOptions = PAGE_SIZE_OPTIONS;

  totalRange: number;
  totalPages: number;

  rangeStartIndex = 0;
  rangeEndIndex = 0;

  isPaginationVisible$: Observable<boolean>;

  private readonly PAGINATION_LOADING_TIMEOUT = PAGINATION_LOADING_TIMEOUT;

  constructor(
    public readonly paginationControlsService: PaginationControlsService,
    private readonly store: Store
  ) {}

  ngOnInit(): void {
    this.isPaginationVisible$ = this.store.select(getPaginationVisibility);

    this.pageSize =
      this.paginationControlsService.getPageSizeFromLocalStorage();

    this.totalRange = this.paginationControlsService.range;
    this.totalPages = this.paginationControlsService.pages;

    this.updateRangeIndexes(this.pageSize, this.totalRange);

    this.disabled = this.paginationControlsService.range <= MIN_PAGE_SIZE;
  }

  ngOnDestroy(): void {
    this.paginationControlsService.currentPage = 0;
    this.paginationControlsService.pages = 0;
    this.paginationControlsService.range = 0;
  }

  onPageSizeChange(pageSizeOption: number): void {
    this.disabled = true;
    this.gridApi.showLoadingOverlay();

    this.pageSize = pageSizeOption;
    this.paginationControlsService.setPageSizeToLocalStorage(pageSizeOption);

    // Without timeout AG Grid cannot render the loading overlay
    setTimeout(() => {
      this.gridApi.paginationSetPageSize(pageSizeOption);
      this.updateRangeIndexes(this.pageSize, this.totalRange);

      this.gridApi.hideOverlay();

      this.paginationControlsService.currentPage =
        this.gridApi.paginationGetCurrentPage();
      this.totalPages = this.gridApi.paginationGetTotalPages();
      this.disabled = false;
    }, this.PAGINATION_LOADING_TIMEOUT);
  }

  onPageChange(paginationType: PaginationType): void {
    this.disabled = true;
    this.gridApi.showLoadingOverlay();

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
          throw new Error('Unhandled pagination event type');
        }
      }
      this.gridApi.hideOverlay();
      this.paginationControlsService.currentPage =
        this.gridApi.paginationGetCurrentPage();
      this.updateRangeIndexes(this.pageSize, this.totalRange);
      this.disabled = false;
    }, this.PAGINATION_LOADING_TIMEOUT);
  }

  private updateRangeIndexes(pageSize: number, totalRange: number): void {
    if (totalRange <= pageSize) {
      this.rangeStartIndex = 1;
      this.rangeEndIndex = totalRange;
    } else {
      const currPageTmp = this.gridApi.paginationGetCurrentPage();
      if (currPageTmp === 0) {
        this.rangeStartIndex = 1;
        this.rangeEndIndex = pageSize;
      } else {
        this.rangeStartIndex = currPageTmp * pageSize + 1;
        this.rangeEndIndex = Math.min(
          this.rangeStartIndex + pageSize,
          totalRange
        );
      }
    }
  }
}
