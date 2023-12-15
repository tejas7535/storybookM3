import { Component, Input, OnInit } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { GridApi } from 'ag-grid-community';

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
})
export class PaginationControlsComponent implements OnInit {
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

  private readonly PAGINATION_LOADING_TIMEOUT = PAGINATION_LOADING_TIMEOUT;

  public constructor(
    public readonly transLocoService: TranslocoService,
    private readonly paginationControlsService: PaginationControlsService
  ) {}

  ngOnInit(): void {
    this.pageSize = this.paginationControlsService.getPageSize();

    this.totalRange = this.paginationControlsService.range;
    this.totalPages = this.paginationControlsService.pages;

    this.updateRangeIndexes(this.pageSize, this.totalRange);
    this.disabled = this.gridApi.paginationGetTotalPages() === this.totalPages;
  }

  onPageSizeChange(pageSizeOption: number): void {
    this.disabled = true;
    this.gridApi.showLoadingOverlay();

    this.pageSize = pageSizeOption;
    this.paginationControlsService.setPageSize(pageSizeOption);

    // Without timeout AG Grid cannot render the loading overlay
    setTimeout(() => {
      this.gridApi.paginationSetPageSize(pageSizeOption);
      this.updateRangeIndexes(this.pageSize, this.totalRange);

      this.gridApi.hideOverlay();

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
      this.updateRangeIndexes(this.pageSize, this.totalRange);
      this.disabled = false;
    }, this.PAGINATION_LOADING_TIMEOUT);
  }

  private updateRangeIndexes(pageSize: number, totalRange: number): void {
    if (totalRange <= pageSize) {
      this.rangeStartIndex = 1;
      this.rangeEndIndex = totalRange;
    } else {
      this.rangeStartIndex =
        this.gridApi.paginationGetCurrentPage() * pageSize + 1;
      this.rangeEndIndex = Math.min(
        this.rangeStartIndex + pageSize,
        totalRange
      );
    }
  }
}
