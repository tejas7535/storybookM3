import { ActiveCaseFacade } from '@gq/core/store/active-case/active-case.facade';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { QuotationDetail } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import {
  QUOTATION_DETAIL_MOCK,
  QUOTATION_DETAILS_MOCK,
} from '../../../../../testing/mocks';
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

  describe('updateStoreForSimulation', () => {
    it('should call addSimulatedQuotation with the correct parameters', () => {
      const gqId = 1;
      const simulatedRows: QuotationDetail[] = QUOTATION_DETAILS_MOCK;
      const simulatedField = ColumnFields.PRICE;
      service['activeCaseFacade'].addSimulatedQuotation = jest.fn();

      service.updateStoreForSimulation(gqId, simulatedRows, simulatedField);

      expect(
        service['activeCaseFacade'].addSimulatedQuotation
      ).toHaveBeenCalledWith(gqId, simulatedRows, simulatedField);
    });
  });

  describe('getAffectedKpi', () => {
    test('should return the value of the KPI', () => {
      const kpis: KpiValue[] = [
        { key: 'price', value: 1 },
        { key: 'gpi', value: 2 },
      ];
      const kpiName = 'gpi';

      const result = service.getAffectedKpi(kpis, kpiName);

      expect(result).toBe(2);
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
        const value = 10;
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
