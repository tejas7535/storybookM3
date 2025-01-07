import { environment } from '@ea/environments/environment';
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
  const createHttp = createHttpFactory(DownstreamCalculationService);

  beforeEach(() => {
    spectator = createHttp();
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
      `${environment.downstreamCo2ApiUrl}co2ecalculation/calculate?designation=${designation}`,
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
      `${environment.downstreamCo2ApiUrl}co2ecalculation/cancalculate?designation=${designation}`,
      HttpMethod.GET
    );

    req.flush({ available: expectedResponse });
  });
});
