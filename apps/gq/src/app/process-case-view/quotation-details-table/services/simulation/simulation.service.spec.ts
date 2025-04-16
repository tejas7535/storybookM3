import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { QuotationDetail } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../../testing/mocks/models/quotation-detail/quotation-details.mock';
import { SimulationService } from './simulation.service';

describe('SimulationService', () => {
  let service: SimulationService;
  let spectator: SpectatorService<SimulationService>;

  const createService = createServiceFactory({
    service: SimulationService,
    mocks: [ActiveCaseFacade],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });
  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('performSimulation', () => {
    test('should call perform simulation', () => {
      const priceSourceOption = PriceSourceOptions.GQ;
      const gqId = 1;
      const selectedDetails = [QUOTATION_DETAIL_MOCK];
      const simulatedField = ColumnFields.PRICE_SOURCE;
      const simulatedValue = 10;

      const performSimulationSpy = jest.spyOn(
        service['activeCaseFacade'],
        'performSimulation'
      );

      service.performSimulation(
        gqId,
        simulatedField,
        simulatedValue,
        priceSourceOption,
        selectedDetails
      );

      expect(performSimulationSpy).toHaveBeenCalledWith(
        gqId,
        simulatedField,
        simulatedValue,
        priceSourceOption,
        selectedDetails
      );
    });
  });

  describe('calculateAffectedKpis', () => {
    test('should return empty array for order quantity', () => {
      const value = 10;
      const simulatedField = ColumnFields.ORDER_QUANTITY;
      const detail = QUOTATION_DETAILS_MOCK[0];
      const isRelativePrice = false;

      const result = service.calculateAffectedKPIs(
        value,
        simulatedField,
        detail,
        isRelativePrice
      );

      expect(result).toEqual([]);
    });

    describe('relative price', () => {
      test('should return the updated target price', () => {
        const value = 10;
        const simulatedField = ColumnFields.TARGET_PRICE;
        const detail = { ...QUOTATION_DETAIL_MOCK, targetPrice: 20 };
        const isRelativePrice = true;

        const result = service.calculateAffectedKPIs(
          value,
          simulatedField,
          detail,
          isRelativePrice
        );

        expect(result).toEqual([{ key: ColumnFields.TARGET_PRICE, value: 22 }]);
      });
      test('should return undefined for kpi value when relative calculated value is the same as the original value', () => {
        const value = 0;
        const simulatedField = ColumnFields.TARGET_PRICE;
        const detail = { ...QUOTATION_DETAIL_MOCK, targetPrice: 20 };
        const isRelativePrice = true;

        const result = service.calculateAffectedKPIs(
          value,
          simulatedField,
          detail,
          isRelativePrice
        );

        expect(result).toEqual([
          { key: ColumnFields.TARGET_PRICE, value: undefined },
        ]);
      });

      test('should return the updated price', () => {
        const value = 10;
        const simulatedField = ColumnFields.PRICE;
        const detail: QuotationDetail = { ...QUOTATION_DETAIL_MOCK, price: 10 };
        const isRelativePrice = true;

        const result = service.calculateAffectedKPIs(
          value,
          simulatedField,
          detail,
          isRelativePrice
        );

        expect(result).toEqual([
          { key: ColumnFields.PRICE, value: 11 },
          {
            key: ColumnFields.GPI,
            value: -0.8182,
          },
          {
            key: ColumnFields.GPM,
            value: -1.7273,
          },
          {
            key: ColumnFields.DISCOUNT,
            value: 0.89,
          },
        ]);
      });
      test('should return the updated gpi', () => {
        const value = 0.1;
        const simulatedField = ColumnFields.GPI;
        const detail: QuotationDetail = { ...QUOTATION_DETAIL_MOCK, price: 10 };
        const isRelativePrice = true;

        const result = service.calculateAffectedKPIs(
          value,
          simulatedField,
          detail,
          isRelativePrice
        );

        expect(result).toEqual([
          { key: ColumnFields.PRICE, value: 22.22 },
          {
            key: ColumnFields.GPM,
            value: -0.3501,
          },
          {
            key: ColumnFields.DISCOUNT,
            value: 0.7778,
          },
        ]);
      });
    });

    describe('absolute price', () => {
      test('should return the updated target price', () => {
        const value = 10;
        const simulatedField = ColumnFields.TARGET_PRICE;
        const detail = { ...QUOTATION_DETAIL_MOCK, targetPrice: 20 };
        const isRelativePrice = false;

        const result = service.calculateAffectedKPIs(
          value,
          simulatedField,
          detail,
          isRelativePrice
        );

        expect(result).toEqual([{ key: ColumnFields.TARGET_PRICE, value: 10 }]);
      });
    });
  });
});
