import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import { SharedQuotationPaths } from '@gq/shared/services/rest/shared-quotation/models/shared-quotation-paths.enum';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { SHARED_QUOTATION_MOCK } from '../../../../../testing/mocks/models/shared-quotation.mock';
import { SharedQuotationService } from './shared-quotation.service';

describe('SharedQuotationService', () => {
  let service: SharedQuotationService;
  let spectator: SpectatorService<SharedQuotationService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: SharedQuotationService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkSharedQuotation', () => {
    test('should call check endpoint', () => {
      const gqId = 123;
      service
        .getSharedQuotation(gqId)
        .subscribe((res) => expect(res).toEqual(SHARED_QUOTATION_MOCK));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SharedQuotationPaths.PATH_SHARED_QUOTATION}/${gqId}`
      );
      expect(req.request.method).toBe(HttpMethod.GET);
      req.flush(gqId);
    });
  });

  describe('saveSharedQuotation', () => {
    test('should call save endpoint', () => {
      const gqId = 123;
      service
        .saveSharedQuotation(gqId)
        .subscribe((res) => expect(res).toEqual(SHARED_QUOTATION_MOCK));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SharedQuotationPaths.PATH_SHARED_QUOTATION}/${gqId}`
      );
      expect(req.request.method).toBe(HttpMethod.POST);
      req.flush(gqId);
    });
  });

  describe('deleteSharedQuotation', () => {
    test('should call delete endpoint', () => {
      const sharedQuotationId = '123';
      service
        .deleteSharedQuotation(sharedQuotationId)
        .subscribe((res) => expect(res).toBeTruthy());

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${SharedQuotationPaths.PATH_SHARED_QUOTATION}/${sharedQuotationId}`
      );
      expect(req.request.method).toBe(HttpMethod.DELETE);
      req.flush(sharedQuotationId);
    });
  });
});
