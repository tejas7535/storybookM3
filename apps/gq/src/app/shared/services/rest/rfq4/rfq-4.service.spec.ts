import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';

import { ApiVersion } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { Rfq4PathsEnum } from './models/rfq-4-paths.enum';
import { Rfq4Service } from './rfq-4.service';

describe('Rfq4Service', () => {
  let spectator: SpectatorService<Rfq4Service>;
  let service: Rfq4Service;
  let httpMock: HttpTestingController;

  const createService = createServiceFactory({
    service: Rfq4Service,
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
    httpMock = spectator.inject(HttpTestingController);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
    expect(httpMock).toBeTruthy();
    expect(localStorage).toBeTruthy();
  });

  describe('REST Calls', () => {
    test('findCalculators', () => {
      const gqPositionId = '12345';
      const expectedResponse = {
        processVariables: {
          foundCalculators: ['Calculator1', 'Calculator2'],
        },
      };

      service['featureToggleService'].isEnabled = jest.fn(() => false);
      service.findCalculators(gqPositionId).subscribe((response) => {
        expect(response).toEqual(
          expectedResponse.processVariables.foundCalculators
        );
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_FIND_CALCULATORS}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });

    test('recalculateSqv', () => {
      const gqPositionId = '12345';
      const message = 'Recalculate SQV';
      const expectedResponse = {
        processVariables: {
          rfq4Status: 'Success',
        },
      };

      service.recalculateSqv(gqPositionId, message).subscribe((response) => {
        expect(response).toEqual(expectedResponse.processVariables.rfq4Status);
      });

      const req = httpMock.expectOne(
        `${ApiVersion.V1}/${Rfq4PathsEnum.RFQ4_PATH}/${gqPositionId}/${Rfq4PathsEnum.RFQ4_PATH_RECALCULATE_SQV}`
      );
      expect(req.request.method).toBe('POST');
      req.flush(expectedResponse);
    });
  });
});
