import { LubricantType } from '@lsa/shared/constants';
import { RecommendationFormValue } from '@lsa/shared/models';
import {
  mockApplicationInput,
  mockLubricantInput,
  mockLubricationPointsInput,
} from '@lsa/testing/mocks/input.mock';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import { ResultInputsService } from './result-inputs.service';

describe('ResultInputsService', () => {
  let spectator: SpectatorService<ResultInputsService>;
  const createService = createServiceFactory({
    service: ResultInputsService,
    imports: [provideTranslocoTestingModule({ en: {} })],
  });

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  describe('when getting result inputs', () => {
    let mockFormValue: RecommendationFormValue;

    beforeEach(() => {
      mockFormValue = {
        lubricationPoints: mockLubricationPointsInput,
        lubricant: mockLubricantInput,
        application: mockApplicationInput,
      };
    });

    it('should return result inputs', () => {
      const result = spectator.service.getResultInputs(mockFormValue);

      expect(result).toMatchSnapshot();
    });
  });

  describe('when getting non arcanol inputs', () => {
    let mockFormValue: RecommendationFormValue;

    beforeEach(() => {
      mockFormValue = {
        lubricationPoints: mockLubricationPointsInput,
        lubricant: {
          ...mockLubricantInput,
          lubricantType: LubricantType.Grease,
        },
        application: mockApplicationInput,
      };
    });

    it('should return result inputs', () => {
      const result = spectator.service.getResultInputs(mockFormValue);

      expect(result).toMatchSnapshot();
    });
  });
});
