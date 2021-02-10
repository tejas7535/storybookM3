import { SpectatorService } from '@ngneat/spectator';
import { createServiceFactory } from '@ngneat/spectator/jest';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_MOCK,
} from '../../../../testing/mocks';
import { loadQuotationSuccess } from '../../../core/store';
import { PriceService } from './price.service';

describe('PriceService', () => {
  let service: PriceService;
  let spectator: SpectatorService<PriceService>;
  const createService = createServiceFactory({
    service: PriceService,
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('addCalculations', () => {
    test('should call addCalculations', () => {
      service.addCalculationsForDetails = jest
        .fn()
        .mockReturnValue([QUOTATION_DETAIL_MOCK]);

      const result = service.addCalculations(QUOTATION_MOCK);

      expect(result).toEqual({
        item: QUOTATION_MOCK,
        type: loadQuotationSuccess.type,
      });
    });
  });

  describe('addCalculationForDetails', () => {
    test('should call addCalculationForDetail', () => {
      const details = [QUOTATION_DETAIL_MOCK];
      service.addCalculationsForDetail = jest.fn(() => details[0]);

      const result = service.addCalculationsForDetails(details);
      expect(result).toEqual(result);
      expect(service.addCalculationsForDetail).toHaveBeenCalledTimes(1);
    });
  });

  describe('addCalculationForDetail', () => {
    test('should return detail', () => {
      const detail = QUOTATION_DETAIL_MOCK;
      service.calculatePercentDiffernce = jest.fn(() => 1);
      service.calculateNetValue = jest.fn(() => 2);

      const result = service.addCalculationsForDetail(detail);
      expect(result).toEqual({ ...detail, percentDifference: 1, netValue: 2 });
      expect(service.calculatePercentDiffernce).toHaveBeenCalledTimes(1);
      expect(service.calculateNetValue).toHaveBeenCalledTimes(1);
    });
  });

  describe('calculatePercentDifference', () => {
    test('should Calculate % diff', () => {
      const detail = {
        lastCustomerPrice: 110,
        price: 120,
      } as any;

      const result = service.calculatePercentDiffernce(detail);

      expect(result).toEqual(9.09);
    });
    test('should return undefined', () => {
      const detail = {
        lastCustomerPrice: undefined,
        price: 100,
      } as any;

      const result = service.calculatePercentDiffernce(detail);

      expect(result).toEqual(undefined);
    });
  });

  describe('calculateNetValue', () => {
    test('should return NetValue', () => {
      const price = 10;
      const quantity = 5;

      const result = service.calculateNetValue(price, quantity);
      expect(result).toEqual(50);
    });
    test('should return undefined', () => {
      const result = service.calculateNetValue(undefined, 10);
      expect(result).toBeUndefined();
    });
  });
});
