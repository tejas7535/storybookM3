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

      const res = service.buildRegressionPoints(coefficients, transactions);
      expect(service.regressionFunction).toHaveBeenCalledTimes(213);

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
});
