import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { RowNode } from 'ag-grid-community';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { PriceSourceSimulationService } from './price-source-simulation.service';
import { SimulationService } from './simulation.service';

describe('PriceSourceSimulationService', () => {
  let service: PriceSourceSimulationService;
  let spectator: SpectatorService<PriceSourceSimulationService>;

  const createService = createServiceFactory({
    service: PriceSourceSimulationService,
    mocks: [SimulationService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('onPriceSourceSimulation', () => {
    describe('should not simulate', () => {
      test('should not simulate if price source are same', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          priceSource: PriceSource.GQ,
        };
        const row = { data: detail } as RowNode;

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.GQ, 1, [row]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [], ColumnFields.PRICE_SOURCE);
      });

      test('should not simulate if no gq price available', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          recommendedPrice: undefined as any,
        };
        const row = { data: detail } as RowNode;

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.GQ, 1, [row]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [], ColumnFields.PRICE_SOURCE);
      });
      test('should not simulate if no strategic price available', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          recommendedPrice: undefined as any,
          strategicPrice: undefined,
        };
        const row = { data: detail } as RowNode;

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.GQ, 1, [row]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [], ColumnFields.PRICE_SOURCE);
      });

      test('should not simulate if no target price available', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          targetPrice: undefined as any,
        };
        const row = { data: detail } as RowNode;

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.TARGET_PRICE, 1, [
          row,
        ]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [], ColumnFields.PRICE_SOURCE);
      });
      test('should not simulate if no sap price available', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          sapPriceCondition: undefined as any,
        };
        const row = { data: detail } as RowNode;

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.SAP, 1, [row]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [], ColumnFields.PRICE_SOURCE);
      });
    });

    describe('should simulate', () => {
      test('should simulate gq price', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          priceSource: PriceSource.SAP_STANDARD,
        };
        const row = { data: detail } as RowNode;

        service['simulationService'].calculateAffectedKPIs = jest.fn(() => [
          { key: 'price', value: 12 },
        ]);
        jest
          .spyOn(service['simulationService'], 'getAffectedKpi')
          .mockImplementation((_values: KpiValue[], field: string) => {
            if (field === ColumnFields.PRICE) {
              return 12;
            }
            if (field === ColumnFields.GPI) {
              return 80;
            }
            if (field === ColumnFields.GPM) {
              return 60;
            }
            if (field === ColumnFields.DISCOUNT) {
              return 20;
            }

            return 0;
          });
        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 12,
          netValue: 120,
          priceSource: PriceSource.GQ,
          gpi: 80,
          gpm: 60,
          discount: 20,
          priceDiff: -92.94,
          rlm: -104.17,
        };

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.GQ, 1, [row]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [simulatedDetail], ColumnFields.PRICE_SOURCE);
      });

      test('should simulate sap price', () => {
        // given:
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          priceSource: PriceSource.GQ,
        };
        const row = { data: detail } as RowNode;

        service['simulationService'].calculateAffectedKPIs = jest.fn(() => [
          { key: 'price', value: 12 },
        ]);
        jest
          .spyOn(service['simulationService'], 'getAffectedKpi')
          .mockImplementation((_values: KpiValue[], field: string) => {
            if (field === ColumnFields.PRICE) {
              return 12;
            }
            if (field === ColumnFields.GPI) {
              return 80;
            }
            if (field === ColumnFields.GPM) {
              return 60;
            }
            if (field === ColumnFields.DISCOUNT) {
              return 20;
            }

            return 0;
          });
        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 12,
          netValue: 120,
          priceSource: PriceSource.SAP_STANDARD,
          gpi: 80,
          gpm: 60,
          discount: 20,
          priceDiff: -92.94,
          rlm: -104.17,
        };

        // when:
        service.onPriceSourceSimulation(PriceSourceOptions.SAP, 1, [row]);

        // then:
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1, [simulatedDetail], ColumnFields.PRICE_SOURCE);
      });
    });
  });
});
