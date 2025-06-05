import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models/api-version.enum';
import { Rfq4PathsEnum } from '@gq/shared/services/rest/rfq4/models/rfq-4-paths.enum';
import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { CalculatorTab } from '../rfq-4-overview-view/models/calculator-tab.enum';
import { RfqRequest } from './models/get-rfq-requests-response.interface';
import { Rfq4CalculatorService } from './rfq-4-calculator.service';
import { Rfq4CalculatorPaths } from './rfq-4-calculator-paths.enum';

describe('Rfq4CalculatorService', () => {
  let service: Rfq4CalculatorService;
  let spectator: SpectatorService<Rfq4CalculatorService>;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: Rfq4CalculatorService,
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      mockProvider(TranslocoLocaleService),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getRfqRequests', () => {
    it('should fetch RFQ requests for a given tab', () => {
      const mockResponse = {
        results: [
          {
            gqPositionId: '1',
            status: CalculatorTab.OPEN,
          } as unknown as RfqRequest,
          { gqPositionId: '2', status: CalculatorTab.OPEN },
        ],
      };

      service.getRfqRequests(CalculatorTab.OPEN).subscribe((requests) => {
        expect(requests.length).toBe(2);
        expect(requests[0].gqPositionId).toBe('1');
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${Rfq4CalculatorPaths.RFQ_4_CALCULATOR_OVERVIEW}/${CalculatorTab.OPEN}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('loadRfqRequestsCount', () => {
    it('should load RFQ requests count for all tabs', () => {
      const mockResponse = {
        results: {
          openCount: 5,
          inProgressCount: 3,
          doneCount: 2,
        },
      };

      service.loadRfqRequestsCount().subscribe((counts) => {
        expect(counts[CalculatorTab.OPEN]).toBe(5);
        expect(counts[CalculatorTab.IN_PROGRESS]).toBe(3);
        expect(counts[CalculatorTab.DONE]).toBe(2);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${Rfq4CalculatorPaths.RFQ_4_REQUESTS_COUNT}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
