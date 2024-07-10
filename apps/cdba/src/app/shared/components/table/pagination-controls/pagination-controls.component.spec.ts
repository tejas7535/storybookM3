import { CommonModule } from '@angular/common';
import { waitForAsync } from '@angular/core/testing';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import {
  createComponentFactory,
  mockProvider,
  Spectator,
} from '@ngneat/spectator/jest';
import { PushPipe } from '@ngrx/component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { GridApi } from 'ag-grid-community';
import { MockModule, MockPipe } from 'ng-mocks';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getPaginationVisibility } from '@cdba/core/store';
import { PaginationType } from '@cdba/shared/constants/pagination';

import { BetaFeatureModule } from '../../beta-feature/beta-feature.module';
import { PaginationControlsComponent } from './pagination-controls.component';
import { PaginationControlsService } from './service/pagination-controls.service';

describe('PaginationControlsComponent', () => {
  let component: PaginationControlsComponent;
  let spectator: Spectator<PaginationControlsComponent>;
  let store: MockStore;

  const createComponent = createComponentFactory({
    component: PaginationControlsComponent,
    imports: [
      CommonModule,
      MatButtonModule,
      MatIconModule,
      MatMenuModule,
      MockModule(BetaFeatureModule),
      MockPipe(PushPipe),
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      mockProvider(PaginationControlsService, {
        getPageSizeFromLocalStorage: jest.fn(),
        setPageSizeToLocalStorage: jest.fn(),
        range: 100,
        pages: 1,
        currentPage: 0,
      }),
      provideMockStore({}),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);

    store.overrideSelector(getPaginationVisibility, true);

    const gridApi = {
      paginationSetPageSize: jest.fn(),
      paginationGetPageSize: jest.fn(),

      paginationGetCurrentPage: jest.fn(),
      paginationGetTotalPages: jest.fn(),

      paginationGoToFirstPage: jest.fn(),
      paginationGoToLastPage: jest.fn(),
      paginationGoToNextPage: jest.fn(),
      paginationGoToPreviousPage: jest.fn(),

      showLoadingOverlay: jest.fn(),
      hideOverlay: jest.fn(),
    } as unknown as GridApi;

    spectator.setInput('gridApi', gridApi);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOninit', () => {
    beforeEach(() => {
      component['updateRangeIndexes'] = jest.fn();
      component['paginationControlsService'].getPageSizeFromLocalStorage =
        jest.fn(() => 1);
    });

    it('should initialise the component with enabled controls', waitForAsync(() => {
      component.gridApi.paginationGetTotalPages = jest.fn(() => 10);

      component.ngOnInit();

      component.isPaginationVisible$.subscribe({
        next: (isVisible) => {
          expect(isVisible).toBe(true);
        },
      });

      expect(component.pageSize).toEqual(1);
      expect(component.totalRange).toEqual(100);
      expect(component.totalPages).toEqual(1);

      expect(component['updateRangeIndexes']).toHaveBeenCalledWith(1, 100);
      expect(component.disabled).toEqual(false);
    }));

    it('should initialise the component with disabled controls', waitForAsync(() => {
      component.gridApi.paginationGetTotalPages = jest.fn(() => 1);
      component['paginationControlsService'].range = 1;

      component.ngOnInit();

      component.isPaginationVisible$.subscribe({
        next: (isVisible) => {
          expect(isVisible).toBe(true);
        },
      });

      expect(component.pageSize).toEqual(1);
      expect(component.totalRange).toEqual(1);
      expect(component.totalPages).toEqual(1);
      expect(component['updateRangeIndexes']).toHaveBeenCalledWith(1, 1);
      expect(component.disabled).toEqual(true);
    }));
  });

  describe('onPageSizeChange', () => {
    it('should change page size', () => {
      jest.useFakeTimers();
      component['updateRangeIndexes'] = jest.fn();
      component.gridApi.paginationGetTotalPages = jest.fn();
      const expectedPageSize = 100;

      component.onPageSizeChange(expectedPageSize);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);
      expect(component.pageSize).toEqual(expectedPageSize);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);

      jest.runAllTimers();

      expect(component.gridApi.paginationSetPageSize).toHaveBeenCalledWith(
        expectedPageSize
      );
      expect(component['updateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component.gridApi.paginationGetTotalPages).toHaveBeenCalledTimes(
        1
      );
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
    it('should update indexes when page size decresed', () => {
      jest.useFakeTimers();
      component.pageSize = 100;
      component.totalPages = 10;
      component.totalRange = 1000;
      component.gridApi.paginationGetCurrentPage = jest.fn(() => 2);
      component.gridApi.paginationGetTotalPages = jest.fn(() => 20);

      const expectedPageSize = 50;
      const expectedTotalPages = 20;
      const expectedRangeStartIndex = 101;
      const expectedRangeEndIndex = 151;

      component.onPageSizeChange(expectedPageSize);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);
      expect(component.pageSize).toEqual(expectedPageSize);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);

      jest.runAllTimers();

      expect(component.gridApi.paginationSetPageSize).toHaveBeenCalledWith(
        expectedPageSize
      );
      expect(component.totalPages).toEqual(expectedTotalPages);
      expect(component.rangeStartIndex).toEqual(expectedRangeStartIndex);
      expect(component.rangeEndIndex).toEqual(expectedRangeEndIndex);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component.gridApi.paginationGetTotalPages).toHaveBeenCalledTimes(
        1
      );
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
    it('should update indexes when page size increased', () => {
      jest.useFakeTimers();
      component.pageSize = 100;
      component.totalPages = 10;
      component.totalRange = 1000;
      component.gridApi.paginationGetCurrentPage = jest.fn(() => 2);
      component.gridApi.paginationGetTotalPages = jest.fn(() => 4);

      const expectedPageSize = 250;
      const expectedTotalPages = 4;
      const expectedRangeStartIndex = 501;
      const expectedRangeEndIndex = 751;

      component.onPageSizeChange(expectedPageSize);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);
      expect(component.pageSize).toEqual(expectedPageSize);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);

      jest.runAllTimers();

      expect(component.gridApi.paginationSetPageSize).toHaveBeenCalledWith(
        expectedPageSize
      );
      expect(component.totalPages).toEqual(expectedTotalPages);
      expect(component.rangeStartIndex).toEqual(expectedRangeStartIndex);
      expect(component.rangeEndIndex).toEqual(expectedRangeEndIndex);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component.gridApi.paginationGetTotalPages).toHaveBeenCalledTimes(
        1
      );
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
  });
  describe('onPageChange', () => {
    beforeEach(() => {
      component['updateRangeIndexes'] = jest.fn();
    });

    it('should go to first page', () => {
      jest.useFakeTimers();

      component.onPageChange(PaginationType.FIRST);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(component.gridApi.paginationGoToFirstPage).toHaveBeenCalledTimes(
        1
      );
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['updateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
    it('should go to last page', () => {
      jest.useFakeTimers();

      component.onPageChange(PaginationType.LAST);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(component.gridApi.paginationGoToLastPage).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['updateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
    it('should go to next page', () => {
      jest.useFakeTimers();

      component.onPageChange(PaginationType.NEXT);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(component.gridApi.paginationGoToNextPage).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['updateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
    it('should go to previous page', () => {
      jest.useFakeTimers();

      component.onPageChange(PaginationType.PREVIOUS);

      expect(component.disabled).toEqual(true);
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(
        component.gridApi.paginationGoToPreviousPage
      ).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['updateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(component.disabled).toEqual(false);

      jest.useRealTimers();
    });
    it('should throw error on unhandled pagination type', () => {
      jest.useFakeTimers();

      component.onPageChange({} as PaginationType);

      expect(() => {
        jest.runAllTimers();
      }).toThrowError(new Error('Unhandled pagination event type'));

      jest.useRealTimers();
    });
  });

  describe('updateRangeIndexes', () => {
    it('should update range indexes when range = page size', () => {
      component['updateRangeIndexes'](100, 100);

      expect(component.rangeStartIndex).toEqual(1);
      expect(component.rangeEndIndex).toEqual(100);
    });
    it('should update range indexes when range < page size', () => {
      component['updateRangeIndexes'](100, 90);

      expect(component.rangeStartIndex).toEqual(1);
      expect(component.rangeEndIndex).toEqual(90);
    });
    it('should update range indexes when range > page size, page = first', () => {
      component.gridApi.paginationGetCurrentPage = jest.fn(() => 0);

      component['updateRangeIndexes'](100, 1000);

      expect(component.rangeStartIndex).toEqual(1);
      expect(component.rangeEndIndex).toEqual(100);
    });
    it('should update range indexes when range > page size, page != first & page != last', () => {
      component.gridApi.paginationGetCurrentPage = jest.fn(() => 3);

      component['updateRangeIndexes'](100, 1000);

      expect(component.rangeStartIndex).toEqual(301);
      expect(component.rangeEndIndex).toEqual(401);
    });
    it('should update range indexes when range > page size, page = last', () => {
      component.gridApi.paginationGetCurrentPage = jest.fn(() => 9);

      component['updateRangeIndexes'](100, 1000);

      expect(component.rangeStartIndex).toEqual(901);
      expect(component.rangeEndIndex).toEqual(1000);
    });
    it('should update range indexes when range > page size, page = last, uneven range', () => {
      component.gridApi.paginationGetCurrentPage = jest.fn(() => 9);

      component['updateRangeIndexes'](100, 988);

      expect(component.rangeStartIndex).toEqual(901);
      expect(component.rangeEndIndex).toEqual(988);
    });
  });
});
