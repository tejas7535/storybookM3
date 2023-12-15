import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

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

  describe('Page Size changes', () => {
    it('should return default page size when no size was set', () => {
      const expected = 50;

      const actual = service.getPageSize();

      expect(actual).toEqual(expected);
    });

    it('should get page size after it was set', () => {
      service.setPageSize(100);

      const expected = 100;

      const actual = service.getPageSize();

      expect(actual).toEqual(expected);
    });

    it('should ignore new page size if given unsupported page size', () => {
      service.setPageSize(100);

      expect(service.getPageSize()).toEqual(100);

      service.setPageSize(123);

      expect(service.getPageSize()).toEqual(100);
    });

    it('should set page size to storage if not set', () => {
      expect(service.getPageSize()).toEqual(50);
    });
  });
});
