import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { USER_PAGE_SIZE_KEY } from '@cdba/shared/constants/pagination';
import { LocalStorageMock } from '@cdba/testing/mocks/storage';

import { PaginationControlsService } from './pagination-controls.service';

describe('PaginationControlsService', () => {
  let spectator: SpectatorService<PaginationControlsService>;
  let service: PaginationControlsService;
  let localStorage: LocalStorageMock;

  const createService = createServiceFactory({
    service: PaginationControlsService,
    providers: [{ provide: LOCAL_STORAGE, useClass: LocalStorageMock }],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(PaginationControlsService);
    localStorage = spectator.inject(
      LOCAL_STORAGE
    ) as unknown as LocalStorageMock;

    localStorage.clear();
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('getters/setters', () => {
    it('should set and get the current page', () => {
      const pageNumber = 2;
      service.currentPage = pageNumber;
      expect(service.currentPage).toEqual(pageNumber);
    });

    it('should set and get the number of pages', () => {
      const pageCount = 5;
      service.pages = pageCount;
      expect(service.pages).toEqual(pageCount);
    });

    it('should set and get the range', () => {
      const range = 10;
      service.range = range;
      expect(service.range).toEqual(range);
    });
  });

  describe('setPageSizeToLocalStorage', () => {
    it('should set page size to local storage when valid size is provided', () => {
      const pageSize = 100;
      service.setPageSizeToLocalStorage(pageSize);
      const actual = Number(localStorage.getItem(USER_PAGE_SIZE_KEY));
      expect(actual).toEqual(pageSize);
    });

    it('should not set page size to local storage when invalid size is provided', () => {
      const invalidPageSize = 123;
      service.setPageSizeToLocalStorage(invalidPageSize);
      const actual = localStorage.getItem(USER_PAGE_SIZE_KEY);
      expect(actual).toBeNull();
    });
  });

  describe('Page Size changes', () => {
    it('should return default page size when no size was set', () => {
      const expected = 50;

      const actual = service.getPageSizeFromLocalStorage();

      expect(actual).toEqual(expected);
    });

    it('should get page size after it was set', () => {
      service.setPageSizeToLocalStorage(100);

      const expected = 100;

      const actual = service.getPageSizeFromLocalStorage();

      expect(actual).toEqual(expected);
    });

    it('should ignore new page size if given unsupported page size', () => {
      service.setPageSizeToLocalStorage(100);

      expect(service.getPageSizeFromLocalStorage()).toEqual(100);

      service.setPageSizeToLocalStorage(123);

      expect(service.getPageSizeFromLocalStorage()).toEqual(100);
    });

    it('should set page size to storage if not set', () => {
      expect(service.getPageSizeFromLocalStorage()).toEqual(50);
    });
  });
});
