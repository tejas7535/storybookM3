import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import {
  setPaginationEnabled,
  setPaginationVisible,
  updatePaginationState,
} from '@cdba/core/store';
import { PaginationState } from '@cdba/core/store/reducers/search/search.reducer';
import { USER_PAGE_SIZE_KEY } from '@cdba/shared/constants/pagination';
import { LocalStorageService } from '@cdba/shared/services';

import { PaginationControlsService } from './pagination-controls.service';

describe('PaginationControlsService', () => {
  let spectator: SpectatorService<PaginationControlsService>;
  let service: PaginationControlsService;
  let localStorageService: LocalStorageService;
  let setItemSpy: jest.SpyInstance;
  let store: MockStore;

  const createService = createServiceFactory({
    service: PaginationControlsService,
    providers: [mockProvider(LocalStorageService), provideMockStore()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(PaginationControlsService);
    localStorageService = spectator.inject(LocalStorageService);
    store = spectator.inject(MockStore);

    setItemSpy = jest.spyOn(localStorageService, 'setItem');
    localStorageService.getItem = jest.fn().mockReturnValue(50);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('setupInitialPaginationState', () => {
    it('should dispatch updatePaginationState with pageSize from local storage', () => {
      service.getPageSizeFromLocalStorage = jest.fn(() => 50);
      service.calculateRangeIndexes = jest.fn(() => ({
        currentRangeStartIndex: 1,
        currentRangeEndIndex: 50,
      }));
      const storeSpy = jest.spyOn(store, 'dispatch');

      service.setupInitialPaginationState(10);

      expect(storeSpy).toHaveBeenCalledWith(
        updatePaginationState({
          paginationState: {
            isVisible: true,
            isEnabled: false,
            currentPage: 0,
            pageSize: 50,
            totalPages: 1,
            totalRange: 10,
            currentRangeStartIndex: 1,
            currentRangeEndIndex: 50,
          } as PaginationState,
        })
      );
    });
  });

  describe('setVisible', () => {
    it('should dispatch store action', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');

      service.setVisible(true);

      expect(storeSpy).toHaveBeenCalledWith(
        setPaginationVisible({ isVisible: true })
      );
    });
  });

  describe('disablePagination', () => {
    it('should dispatch store action', () => {
      const storeSpy = jest.spyOn(store, 'dispatch');

      service.disablePagination();

      expect(storeSpy).toHaveBeenCalledWith(
        setPaginationEnabled({ isEnabled: false })
      );
    });
  });

  describe('calculateRangeIndexes', () => {
    it('should update range indexes when range = page size', () => {
      const result = service.calculateRangeIndexes(0, 100, 100);

      expect(result.currentRangeStartIndex).toEqual(1);
      expect(result.currentRangeEndIndex).toEqual(100);
    });
    it('should update range indexes when range < page size', () => {
      const result = service.calculateRangeIndexes(0, 100, 90);

      expect(result.currentRangeStartIndex).toEqual(1);
      expect(result.currentRangeEndIndex).toEqual(90);
    });
    it('should update range indexes when range > page size, page = first', () => {
      const result = service.calculateRangeIndexes(0, 100, 1000);

      expect(result.currentRangeStartIndex).toEqual(1);
      expect(result.currentRangeEndIndex).toEqual(100);
    });
    it('should update range indexes when range > page size, page != first & page != last', () => {
      const result = service.calculateRangeIndexes(3, 100, 1000);

      expect(result.currentRangeStartIndex).toEqual(301);
      expect(result.currentRangeEndIndex).toEqual(401);
    });
    it('should update range indexes when range > page size, page = last', () => {
      const result = service.calculateRangeIndexes(9, 100, 1000);

      expect(result.currentRangeStartIndex).toEqual(901);
      expect(result.currentRangeEndIndex).toEqual(1000);
    });
    it('should update range indexes when range > page size, page = last, uneven range', () => {
      const result = service.calculateRangeIndexes(9, 100, 988);

      expect(result.currentRangeStartIndex).toEqual(901);
      expect(result.currentRangeEndIndex).toEqual(988);
    });
  });

  describe('setPageSizeToLocalStorage', () => {
    it('should set page size to local storage when valid size is provided', () => {
      const pageSize = 100;

      service.setPageSizeToLocalStorage(pageSize);

      expect(setItemSpy).toHaveBeenCalledWith(USER_PAGE_SIZE_KEY, 100, false);
    });

    it('should not set page size to local storage when invalid size is provided', () => {
      const invalidPageSize = 123;

      service.setPageSizeToLocalStorage(invalidPageSize);

      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });

  describe('Page Size changes', () => {
    it('should return default page size when no size was set', () => {
      localStorageService.getItem = jest.fn().mockReturnValue(undefined);
      const expected = 50;

      const actual = service.getPageSizeFromLocalStorage();

      expect(actual).toEqual(expected);
      expect(setItemSpy).toHaveBeenCalledWith(USER_PAGE_SIZE_KEY, 50, false);
    });

    it('should get page size after it was set', () => {
      localStorageService.getItem = jest.fn().mockReturnValue(100);
      const expected = 100;

      const actual = service.getPageSizeFromLocalStorage();

      expect(actual).toEqual(expected);
    });
  });
});
