import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import {
  createServiceFactory,
  HttpMethod,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { QUOTATION_METADATA_MOCK } from '../../../../../../testing/mocks/models/quotation/quotation-metadata.mock';
import { QuotationPaths } from '../models/quotation-paths.enum';
import { QuotationMetadataService } from './quotation-metadata.service';

describe('QuotationMetadataService', () => {
  let service: QuotationMetadataService;
  let spectator: SpectatorService<QuotationMetadataService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: QuotationMetadataService,
    imports: [HttpClientTestingModule],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('updateQuotationMetadata', () => {
    test('should call DataService PUT', () => {
      service
        .updateQuotationMetadata(123, QUOTATION_METADATA_MOCK)
        .subscribe((res) => expect(res).toEqual([]));

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${QuotationPaths.PATH_QUOTATIONS}/123/metadata`
      );
      expect(req.request.method).toBe(HttpMethod.PUT);
      req.flush(QUOTATION_METADATA_MOCK);
    });
  });
});
