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
import { GridApi } from 'ag-grid-enterprise';

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
        disablePagination: jest.fn(),
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
      updateGridOptions: jest.fn(),
      paginationGetPageSize: jest.fn(),

      paginationGetCurrentPage: jest.fn(),
      paginationGetTotalPages: jest.fn(),

      paginationGoToFirstPage: jest.fn(),
      paginationGoToLastPage: jest.fn(),
      paginationGoToNextPage: jest.fn(),
      paginationGoToPreviousPage: jest.fn(),

      setGridOption: jest.fn(),
    } as unknown as GridApi;

    spectator.setInput('gridApi', gridApi);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should invoke calculateRangeIndexes', waitForAsync(() => {
      component.ngOnInit();

      component.paginationState$.subscribe({
        next: (state: PaginationState) => {
          expect(state).toEqual(PAGINATION_STATE_MOCK);
        },
      });
    }));
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe', () => {
      component['paginationStateSubscription'].unsubscribe = jest.fn();

      component.ngOnDestroy();

      expect(
        component['paginationStateSubscription'].unsubscribe
      ).toHaveBeenCalledTimes(1);
    });
  });

  describe('onPageSizeChange', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      component.paginationState = PAGINATION_STATE_MOCK;
      component['paginationControlsService'].calculateRangeIndexes = jest.fn(
        () => ({
          currentRangeStartIndex: 0,
          currentRangeEndIndex: 1,
        })
      );

      storeSpy = jest.spyOn(store, 'dispatch');

      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      jest.clearAllMocks();
    });

    afterAll(() => {
      jest.clearAllMocks();
    });
    it('should update indexes when page size decreased', () => {
      const expectedPageSize = 50;
      const expectedCurrentPage = 2;
      const expectedTotalPages = 20;
      const expectedRangeStartIndex = 0;
      const expectedRangeEndIndex = 1;
      const expectedTotalRange = 1000;

      component.paginationState.pageSize = 100;
      component.paginationState.totalPages = 10;
      component.paginationState.totalRange = expectedTotalRange;

      component.gridApi.paginationGetCurrentPage = jest.fn(
        () => expectedCurrentPage
      );
      component.gridApi.paginationGetTotalPages = jest.fn(
        () => expectedTotalPages
      );

      component.onPageSizeChange(expectedPageSize);
      jest.runAllTimers();

      expect(
        component['paginationControlsService'].disablePagination
      ).toHaveBeenCalledTimes(1);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);
      expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({
        paginationPageSize: expectedPageSize,
      });
      expect(
        component['paginationControlsService'].calculateRangeIndexes
      ).toHaveBeenCalledWith(
        expectedCurrentPage,
        expectedPageSize,
        expectedTotalRange
      );
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isEnabled: true,
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
      expect(component.gridApi.setGridOption).toHaveBeenNthCalledWith(
        1,
        'loading',
        true
      );
      expect(component.gridApi.setGridOption).toHaveBeenNthCalledWith(
        2,
        'loading',
        false
      );
    });
    it('should update indexes when page size increased', () => {
      const expectedPageSize = 250;
      const expectedTotalPages = 4;
      const expectedCurrentPage = 2;
      const expectedTotalRange = 1000;
      const expectedRangeStartIndex = 0;
      const expectedRangeEndIndex = 1;

      component.paginationState.pageSize = 100;
      component.paginationState.totalPages = 10;
      component.paginationState.totalRange = expectedTotalRange;

      component.gridApi.paginationGetCurrentPage = jest.fn(
        () => expectedCurrentPage
      );
      component.gridApi.paginationGetTotalPages = jest.fn(
        () => expectedTotalPages
      );

      component.onPageSizeChange(expectedPageSize);
      jest.runAllTimers();

      expect(
        component['paginationControlsService'].disablePagination
      ).toHaveBeenCalledTimes(1);
      expect(
        component['paginationControlsService'].setPageSizeToLocalStorage
      ).toHaveBeenLastCalledWith(expectedPageSize);
      expect(component.gridApi.updateGridOptions).toHaveBeenCalledWith({
        paginationPageSize: expectedPageSize,
      });
      expect(
        component['paginationControlsService'].calculateRangeIndexes
      ).toHaveBeenCalledWith(
        expectedCurrentPage,
        expectedPageSize,
        expectedTotalRange
      );
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isEnabled: true,
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
      expect(component.gridApi.setGridOption).toHaveBeenNthCalledWith(
        1,
        'loading',
        true
      );
      expect(component.gridApi.setGridOption).toHaveBeenNthCalledWith(
        2,
        'loading',
        false
      );
    });
  });

  describe('onPageChange', () => {
    let storeSpy: jest.SpyInstance;

    beforeEach(() => {
      component.paginationState = PAGINATION_STATE_MOCK;

      component['paginationControlsService'].calculateRangeIndexes = jest.fn(
        () => ({
          currentRangeStartIndex: PAGINATION_STATE_MOCK.currentRangeStartIndex,
          currentRangeEndIndex: PAGINATION_STATE_MOCK.currentRangeEndIndex,
        })
      );

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
      jest.runAllTimers();

      expect(
        component['paginationControlsService'].disablePagination
      ).toHaveBeenCalled();
      expect(component.gridApi.paginationGoToFirstPage).toHaveBeenCalledTimes(
        1
      );
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        true
      );
      expect(
        component['paginationControlsService'].calculateRangeIndexes
      ).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        false
      );
    });
    it('should go to last page', () => {
      component.onPageChange(PaginationType.LAST);
      jest.runAllTimers();

      expect(
        component['paginationControlsService'].disablePagination
      ).toHaveBeenCalled();
      expect(component.gridApi.paginationGoToLastPage).toHaveBeenCalledTimes(1);
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        true
      );
      expect(
        component['paginationControlsService'].calculateRangeIndexes
      ).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        false
      );
    });
    it('should go to next page', () => {
      component.onPageChange(PaginationType.NEXT);
      jest.runAllTimers();

      expect(
        component['paginationControlsService'].disablePagination
      ).toHaveBeenCalled();
      expect(component.gridApi.paginationGoToNextPage).toHaveBeenCalledTimes(1);
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        true
      );
      expect(
        component['paginationControlsService'].calculateRangeIndexes
      ).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        false
      );
    });
    it('should go to previous page', () => {
      component.onPageChange(PaginationType.PREVIOUS);
      jest.runAllTimers();

      expect(
        component['paginationControlsService'].disablePagination
      ).toHaveBeenCalled();
      expect(
        component.gridApi.paginationGoToPreviousPage
      ).toHaveBeenCalledTimes(1);
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        true
      );
      expect(
        component['paginationControlsService'].calculateRangeIndexes
      ).toHaveBeenCalledTimes(1);
      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: PAGINATION_STATE_MOCK,
        })
      );
      expect(component.gridApi.setGridOption).toHaveBeenCalledWith(
        'loading',
        false
      );
    });
    it('should throw error on unhandled pagination type', () => {
      component.onPageChange(undefined);

      expect(() => {
        jest.runAllTimers();
      }).toThrow(new Error('Unhandled pagination event type: undefined'));
    });
  });
});
