import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { USER_PAGE_SIZE_KEY } from '@cdba/shared/constants/pagination';
import { LocalStorageService } from '@cdba/shared/services';

import { PaginationControlsService } from './pagination-controls.service';

describe('PaginationControlsService', () => {
  let spectator: SpectatorService<PaginationControlsService>;
  let service: PaginationControlsService;
  let localStorageService: LocalStorageService;
  let setItemSpy: jest.SpyInstance;

  const createService = createServiceFactory({
    service: PaginationControlsService,
    providers: [mockProvider(LocalStorageService)],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(PaginationControlsService);
    localStorageService = spectator.inject(LocalStorageService);

    setItemSpy = jest.spyOn(localStorageService, 'setItem');
    localStorageService.getItem = jest.fn().mockReturnValue(50);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
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
