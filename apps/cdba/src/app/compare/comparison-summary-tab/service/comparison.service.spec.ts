import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { BomIdentifier } from '@cdba/shared/models';
import { BOM_IDENTIFIER_MOCK } from '@cdba/testing/mocks';
import { COMPARISON_MOCK } from '@cdba/testing/mocks/models/comparison-summary.mock';

import { ComparisonService } from './comparison.service';

describe('ComparisonService', () => {
  let spectator: SpectatorService<ComparisonService>;
  let service: ComparisonService;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: ComparisonService,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ComparisonService);
    httpMock = spectator.inject(HttpTestingController);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  describe('comparison', () => {
    it('should call comparison endpoint', () => {
      const identifiers: BomIdentifier[] = [
        BOM_IDENTIFIER_MOCK,
        BOM_IDENTIFIER_MOCK,
      ];

      service.getComparison(identifiers).subscribe((response) => {
        expect(response).toEqual(COMPARISON_MOCK);
      });

      const req = httpMock.expectOne('api/v1/comparison');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(identifiers);
      req.flush(COMPARISON_MOCK);
    });
  });
});
