import { RecommendationType } from '@gq/core/store/transactions/models/recommendation-type.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { COMPARABLE_LINKED_TRANSACTION_MOCK } from '../../../../../testing/mocks';
import { RegressionService } from './regression.service';

describe('RegressionService', () => {
  let service: RegressionService;
  let spectator: SpectatorService<RegressionService>;

  const createService = createServiceFactory({
    service: RegressionService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  describe('buildRegressionPoints', () => {
    test('should return data', () => {
      const coefficients = { coefficient1: 3.8, coefficient2: -0.8 };
      const transactions = [COMPARABLE_LINKED_TRANSACTION_MOCK];
      service.regressionFunction = jest.fn();
      (service as any)['considerAppliedExchangeRatio'] = jest.fn();

      const res = service.buildRegressionPoints(
        coefficients,
        transactions,
        RecommendationType.MARGIN,
        1
      );
      expect(service.regressionFunction).toHaveBeenCalledTimes(213);
      expect(
        (service as any)['considerAppliedExchangeRatio']
      ).toHaveBeenCalledTimes(213);

      expect(res.length).toEqual(214);
    });
  });
  describe('regressionFunction', () => {
    test('should return data point', () => {
      const coefficient1 = 3.5;
      const coefficient2 = -0.1;
      const quantity = 50;
      const res = service.regressionFunction(
        coefficient1,
        coefficient2,
        quantity
      );
      expect(res).toEqual(22.394_103_765_508_323);
    });
  });

  describe('considerAppliedExchangeRatio', () => {
    test('should return data point if margin regression', () => {
      const dp = 14.3;

      const result = service['considerAppliedExchangeRatio'](
        dp,
        RecommendationType.MARGIN,
        2
      );

      expect(result).toEqual(dp);
    });

    test('should return data point if no exchange ratio', () => {
      const dp = 14.3;

      const result = service['considerAppliedExchangeRatio'](
        dp,
        RecommendationType.PRICE,
        null
      );

      expect(result).toEqual(dp);
    });

    test('should return updated data point if price regression and exchange ratio', () => {
      const dp = 14.3;

      const result = service['considerAppliedExchangeRatio'](
        dp,
        RecommendationType.PRICE,
        2
      );

      expect(result).toEqual(28.6);
    });
  });
});
