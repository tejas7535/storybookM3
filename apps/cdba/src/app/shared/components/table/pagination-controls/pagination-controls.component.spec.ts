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

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { getPaginationState, updatePaginationState } from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import { PaginationType } from '@cdba/shared/constants/pagination';
import { PAGINATION_STATE_MOCK } from '@cdba/testing/mocks';

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
      PushPipe,
      provideTranslocoTestingModule({ en: {} }),
    ],
    providers: [
      mockProvider(PaginationControlsService, {
        getPageSizeFromLocalStorage: jest.fn(),
        setPageSizeToLocalStorage: jest.fn(),
      }),
      provideMockStore({
        selectors: [
          {
            selector: getPaginationState,
            value: PAGINATION_STATE_MOCK,
          },
        ],
      }),
    ],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
    store = spectator.inject(MockStore);

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

  describe('ngOnInit', () => {
    beforeEach(() => {
      component['calculateRangeIndexes'] = jest.fn(() => ({
        currentRangeStartIndex: 0,
        currentRangeEndIndex: 1,
      }));
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should invoke calculateRangeIndexes', waitForAsync(() => {
      const storeSpy = jest.spyOn(store, 'dispatch');

      const expectedPaginationState = {
        ...PAGINATION_STATE_MOCK,
        currentRangeStartIndex: 0,
        currentRangeEndIndex: 1,
      } as PaginationState;

      component.ngOnInit();

      expect(component.paginationStateSubscription).toBeTruthy();
      component.paginationState$.subscribe({
        next: (state: PaginationState) => {
          expect(state).toEqual(PAGINATION_STATE_MOCK);
        },
      });
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({ paginationState: expectedPaginationState })
      );
    }));
  });

  describe('onPageSizeChange', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      component.paginationState = PAGINATION_STATE_MOCK;

      component['calculateRangeIndexes'] = jest.fn(() => ({
        currentRangeStartIndex: 0,
        currentRangeEndIndex: 1,
      }));

      storeSpy = jest.spyOn(store, 'dispatch');

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
    it('should update indexes when page size decreased', () => {
      component.paginationState.pageSize = 100;
      component.paginationState.totalPages = 10;
      const expectedTotalRange = 1000;
      component.paginationState.totalRange = expectedTotalRange;

      const expectedCurrentPage = 2;
      component.gridApi.paginationGetCurrentPage = jest.fn(
        () => expectedCurrentPage
      );
      const expectedTotalPages = 20;
      component.gridApi.paginationGetTotalPages = jest.fn(
        () => expectedTotalPages
      );
      const expectedRangeStartIndex = 0;
      const expectedRangeEndIndex = 1;
      const expectedPageSize = 50;

      component.onPageSizeChange(expectedPageSize);

      expect(storeSpy).toHaveBeenNthCalledWith(
        1,
        updatePaginationState({
          paginationState: {
            ...component.paginationState,
            isDisabled: true,
          } as PaginationState,
        })
      );
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);

      jest.runAllTimers();

      expect(component.gridApi.paginationSetPageSize).toHaveBeenCalledWith(
        expectedPageSize
      );
      expect(component['calculateRangeIndexes']).toHaveBeenCalledWith(50, 1000);
      expect(storeSpy).toHaveBeenNthCalledWith(
        2,
        updatePaginationState({
          paginationState: {
            isDisabled: false,
            isVisible: false,
            currentPage: expectedCurrentPage,
            totalPages: expectedTotalPages,
            pageSize: expectedPageSize,
            currentRangeStartIndex: expectedRangeStartIndex,
            currentRangeEndIndex: expectedRangeEndIndex,
            totalRange: expectedTotalRange,
          } as PaginationState,
        })
      );
      expect(component.gridApi.paginationGetTotalPages).toHaveBeenCalledTimes(
        1
      );
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
    });
    it('should update indexes when page size increased', () => {
      component.paginationState.pageSize = 100;
      component.paginationState.totalPages = 10;
      const expectedTotalRange = 1000;
      component.paginationState.totalRange = expectedTotalRange;

      const expectedCurrentPage = 2;
      component.gridApi.paginationGetCurrentPage = jest.fn(
        () => expectedCurrentPage
      );
      const expectedTotalPages = 4;
      component.gridApi.paginationGetTotalPages = jest.fn(
        () => expectedTotalPages
      );
      const expectedRangeStartIndex = 0;
      const expectedRangeEndIndex = 1;
      const expectedPageSize = 250;

      component.onPageSizeChange(expectedPageSize);

      expect(storeSpy).toHaveBeenNthCalledWith(
        1,
        updatePaginationState({
          paginationState: {
            ...component.paginationState,
            isDisabled: true,
          } as PaginationState,
        })
      );
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);

      jest.runAllTimers();

      expect(component.gridApi.paginationSetPageSize).toHaveBeenCalledWith(
        expectedPageSize
      );
      expect(component['calculateRangeIndexes']).toHaveBeenNthCalledWith(
        1,
        250,
        1000
      );
      expect(storeSpy).toHaveBeenNthCalledWith(
        2,
        updatePaginationState({
          paginationState: {
            isDisabled: false,
            isVisible: false,
            currentPage: expectedCurrentPage,
            totalPages: expectedTotalPages,
            pageSize: expectedPageSize,
            currentRangeStartIndex: expectedRangeStartIndex,
            currentRangeEndIndex: expectedRangeEndIndex,
            totalRange: expectedTotalRange,
          } as PaginationState,
        })
      );
      expect(component.gridApi.paginationGetTotalPages).toHaveBeenCalledTimes(
        1
      );
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPageChange', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      component.paginationState = PAGINATION_STATE_MOCK;

      component['calculateRangeIndexes'] = jest.fn(() => ({
        currentRangeStartIndex: PAGINATION_STATE_MOCK.currentRangeStartIndex,
        currentRangeEndIndex: PAGINATION_STATE_MOCK.currentRangeEndIndex,
      }));

      component.gridApi.paginationGetCurrentPage = jest.fn(
        () => PAGINATION_STATE_MOCK.currentPage
      );
      component.gridApi.paginationGetTotalPages = jest.fn(
        () => PAGINATION_STATE_MOCK.totalPages
      );

      storeSpy = jest.spyOn(store, 'dispatch');

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should go to first page', () => {
      component.onPageChange(PaginationType.FIRST);

      expect(storeSpy).toHaveBeenNthCalledWith(
        1,
        updatePaginationState({
          paginationState: {
            ...component.paginationState,
            isDisabled: true,
          } as PaginationState,
        })
      );
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(component.gridApi.paginationGoToFirstPage).toHaveBeenCalledTimes(
        1
      );
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['calculateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenNthCalledWith(
        2,
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
    });
    it('should go to last page', () => {
      component.onPageChange(PaginationType.LAST);

      expect(storeSpy).toHaveBeenNthCalledWith(
        1,
        updatePaginationState({
          paginationState: {
            ...component.paginationState,
            isDisabled: true,
          } as PaginationState,
        })
      );
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(component.gridApi.paginationGoToLastPage).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['calculateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenNthCalledWith(
        2,
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
    });
    it('should go to next page', () => {
      component.onPageChange(PaginationType.NEXT);

      expect(storeSpy).toHaveBeenNthCalledWith(
        1,
        updatePaginationState({
          paginationState: {
            ...component.paginationState,
            isDisabled: true,
          } as PaginationState,
        })
      );
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(component.gridApi.paginationGoToNextPage).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['calculateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenNthCalledWith(
        2,
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
    });
    it('should go to previous page', () => {
      component.onPageChange(PaginationType.PREVIOUS);

      expect(storeSpy).toHaveBeenNthCalledWith(
        1,
        updatePaginationState({
          paginationState: {
            ...component.paginationState,
            isDisabled: true,
          } as PaginationState,
        })
      );
      expect(component.gridApi.showLoadingOverlay).toHaveBeenCalledTimes(1);

      jest.runAllTimers();

      expect(
        component.gridApi.paginationGoToPreviousPage
      ).toHaveBeenCalledTimes(1);
      expect(component.gridApi.hideOverlay).toHaveBeenCalledTimes(1);
      expect(component['calculateRangeIndexes']).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenNthCalledWith(
        2,
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
    });
    it('should throw error on unhandled pagination type', () => {
      component.onPageChange({} as PaginationType);

      expect(() => {
        jest.runAllTimers();
      }).toThrowError(new Error('Unhandled pagination event type'));
    });
  });

  describe('calculateRangeIndexes', () => {
    it('should update range indexes when range = page size', () => {
      const result = component['calculateRangeIndexes'](100, 100);

      expect(result.currentRangeStartIndex).toEqual(1);
      expect(result.currentRangeEndIndex).toEqual(100);
    });
    it('should update range indexes when range < page size', () => {
      const result = component['calculateRangeIndexes'](100, 90);

      expect(result.currentRangeStartIndex).toEqual(1);
      expect(result.currentRangeEndIndex).toEqual(90);
    });
    it('should update range indexes when range > page size, page = first', () => {
      component.paginationState.currentPage = 0;

      const result = component['calculateRangeIndexes'](100, 1000);

      expect(result.currentRangeStartIndex).toEqual(1);
      expect(result.currentRangeEndIndex).toEqual(100);
    });
    it('should update range indexes when range > page size, page != first & page != last', () => {
      component.paginationState.currentPage = 3;

      const result = component['calculateRangeIndexes'](100, 1000);

      expect(result.currentRangeStartIndex).toEqual(301);
      expect(result.currentRangeEndIndex).toEqual(401);
    });
    it('should update range indexes when range > page size, page = last', () => {
      component.paginationState.currentPage = 9;

      const result = component['calculateRangeIndexes'](100, 1000);

      expect(result.currentRangeStartIndex).toEqual(901);
      expect(result.currentRangeEndIndex).toEqual(1000);
    });
    it('should update range indexes when range > page size, page = last, uneven range', () => {
      component.paginationState.currentPage = 9;

      const result = component['calculateRangeIndexes'](100, 988);

      expect(result.currentRangeStartIndex).toEqual(901);
      expect(result.currentRangeEndIndex).toEqual(988);
    });
  });
});
