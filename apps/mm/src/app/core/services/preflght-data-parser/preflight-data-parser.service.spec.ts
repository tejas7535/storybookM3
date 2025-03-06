import { MMBearingPreflightResponse } from '@mm/shared/models';
import { PREFLIGHT_SUCESS_RESPONSE_MOCK } from '@mm/testing/mocks';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { PreflightDataParserService } from './preflight-data-parser.service';

describe('PreflightDataParserService', () => {
  let spectator: SpectatorService<PreflightDataParserService>;
  const createService = createServiceFactory(PreflightDataParserService);

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should format preflight data correctly', () => {
    const mockData: MMBearingPreflightResponse = PREFLIGHT_SUCESS_RESPONSE_MOCK;

    const result = spectator.service.formatPreflightData(mockData);

    expect(result).toMatchSnapshot();
  });

  it('should throw an error if hydraulic nut type field is missing', () => {
    const mockData: MMBearingPreflightResponse = {
      ...PREFLIGHT_SUCESS_RESPONSE_MOCK,
      data: {
        input: [
          {
            fields: [
              {
                id: 'IDMM_MODULUS_OF_ELASTICITY',
                defaultValue: 'modulus1',
                range: [],
              },
            ],
          },
        ],
      },
    } as Partial<MMBearingPreflightResponse> as MMBearingPreflightResponse;

    expect(() => spectator.service.formatPreflightData(mockData)).toThrow(
      'Cannot find IDMM_HYDRAULIC_NUT_TYPE field'
    );
  });

  it('when there is missing data', () => {
    const mockData: MMBearingPreflightResponse = {
      ...PREFLIGHT_SUCESS_RESPONSE_MOCK,
      data: {
        input: undefined,
      },
    } as Partial<MMBearingPreflightResponse> as MMBearingPreflightResponse;

    expect(() => spectator.service.formatPreflightData(mockData)).toThrow(
      'Cannot find IDMM_HYDRAULIC_NUT_TYPE field'
    );
  });
});
