import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';

import { DownstreamCalculationService } from './downstream-calculation.service';
import {
  DownstreamAPIRequest,
  DownstreamAPIResponse,
  DownstreamOperatingConditions,
} from './downstream-calculation.service.interface';

describe('DownstreamCalculationService', () => {
  let spectator: SpectatorHttp<DownstreamCalculationService>;
  let service: DownstreamCalculationService;
  const createHttp = createHttpFactory(DownstreamCalculationService);

  beforeEach(() => {
    spectator = createHttp();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should call the correct URL with the correct parameters', () => {
    const designation = 'test-designation';
    const calculationParameters: DownstreamAPIRequest = {
      operatingConditions: {
        operatingTimeInHours: 876,
      } as Partial<DownstreamOperatingConditions> as DownstreamOperatingConditions,
      loadcases: [],
    };

    const expectedResponse: DownstreamAPIResponse = {
      product: {
        designation: '123',
      },
    } as Partial<DownstreamAPIResponse> as DownstreamAPIResponse;

    spectator.service
      .getDownstreamCalculation(designation, calculationParameters)
      .subscribe((response) => {
        expect(response).toEqual(expectedResponse);
      });

    const req = spectator.expectOne(
      `${service.downstreamCo2ApiBaseUrl}co2ecalculation/calculate?designation=${designation}`,
      HttpMethod.POST
    );

    expect(req.request.body).toEqual(calculationParameters);
    req.flush(expectedResponse);
  });

  it('should call the correct URL to check if calculation is possible', () => {
    const designation = 'test-designation';

    const expectedResponse = true;

    spectator.service.getCanCalculate(designation).subscribe((response) => {
      expect(response).toEqual(expectedResponse);
    });

    const req = spectator.expectOne(
      `${service.downstreamCo2ApiBaseUrl}co2ecalculation/cancalculate?designation=${designation}`,
      HttpMethod.GET
    );

    req.flush({ available: expectedResponse });
  });
});
