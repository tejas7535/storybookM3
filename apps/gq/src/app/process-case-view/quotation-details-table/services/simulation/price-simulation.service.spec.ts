import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { KpiValue } from '@gq/shared/components/modal/editing-modal/models/kpi-value.model';
import { PriceSource, QuotationDetail } from '@gq/shared/models';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { RowNode } from 'ag-grid-enterprise';

import { QUOTATION_DETAIL_MOCK } from '../../../../../testing/mocks';
import { PriceSimulationService } from './price-simulation.service';
import { SimulationService } from './simulation.service';

describe('PriceSimulationService', () => {
  let service: PriceSimulationService;
  let spectator: SpectatorService<PriceSimulationService>;

  const createService = createServiceFactory({
    service: PriceSimulationService,
    mocks: [SimulationService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('simulateSelectedQuotationDetails', () => {
    describe('should simulate', () => {
      test('should call updateStore for price simulation', () => {
        // given:
        service['simulationService'].updateStoreForSimulation = jest.fn();
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

        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 10,
        };
        const row = [{ data: detail } as RowNode];

        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          netValue: 120,
          price: 12,
          gpi: 80,
          gpm: 60,
          discount: 20,
          rlm: -1.0417,
          priceDiff: -0.9294,
          priceSource: PriceSource.MANUAL,
        };

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.PRICE,
          20,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).toHaveBeenCalledWith(20, ColumnFields.PRICE, detail);
        expect(
          service['simulationService'].getAffectedKpi
        ).toHaveBeenCalledWith([{ key: 'price', value: 12 }], 'price');
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [simulatedDetail], ColumnFields.PRICE);
      });
      test('should call updateStore for gpm simulation', () => {
        // given:
        service['simulationService'].updateStoreForSimulation = jest.fn();
        service['simulationService'].calculateAffectedKPIs = jest.fn(() => [
          { key: 'discount', value: 20 },
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
              return 20;
            }
            if (field === ColumnFields.DISCOUNT) {
              return 20;
            }

            return 0;
          });

        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 10,
        };
        const row = [{ data: detail } as RowNode];

        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          netValue: 120,
          price: 12,
          gpi: 80,
          gpm: 20,
          discount: 20,
          rlm: -1.0417,
          priceDiff: -0.9294,
          priceSource: PriceSource.MANUAL,
        };

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.GPM,
          20,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).toHaveBeenCalledWith(20, ColumnFields.GPM, detail);
        expect(
          service['simulationService'].getAffectedKpi
        ).toHaveBeenCalledWith([{ key: 'discount', value: 20 }], 'discount');
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [simulatedDetail], ColumnFields.GPM);
      });
      test('should call updateStore for gpi simulation', () => {
        // given:
        service['simulationService'].updateStoreForSimulation = jest.fn();
        service['simulationService'].calculateAffectedKPIs = jest.fn(() => [
          { key: 'discount', value: 20 },
        ]);
        jest
          .spyOn(service['simulationService'], 'getAffectedKpi')
          .mockImplementation((_values: KpiValue[], field: string) => {
            if (field === ColumnFields.PRICE) {
              return 12;
            }
            if (field === ColumnFields.GPI) {
              return 20;
            }
            if (field === ColumnFields.GPM) {
              return 80;
            }
            if (field === ColumnFields.DISCOUNT) {
              return 20;
            }

            return 0;
          });

        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 10,
        };
        const row = [{ data: detail } as RowNode];

        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          netValue: 120,
          price: 12,
          gpi: 20,
          gpm: 80,
          discount: 20,
          rlm: -1.0417,
          priceDiff: -0.9294,
          priceSource: PriceSource.MANUAL,
        };

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.GPI,
          20,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).toHaveBeenCalledWith(20, ColumnFields.GPI, detail);
        expect(
          service['simulationService'].getAffectedKpi
        ).toHaveBeenCalledWith([{ key: 'discount', value: 20 }], 'discount');
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [simulatedDetail], ColumnFields.GPI);
      });
      test('should call updateStore for discount simulation', () => {
        // given:
        service['simulationService'].updateStoreForSimulation = jest.fn();
        service['simulationService'].calculateAffectedKPIs = jest.fn(() => [
          { key: 'gpi', value: 20 },
        ]);
        jest
          .spyOn(service['simulationService'], 'getAffectedKpi')
          .mockImplementation((_values: KpiValue[], field: string) => {
            if (field === ColumnFields.PRICE) {
              return 12;
            }
            if (field === ColumnFields.GPI) {
              return 20;
            }
            if (field === ColumnFields.GPM) {
              return 80;
            }
            if (field === ColumnFields.DISCOUNT) {
              return 20;
            }

            return 0;
          });

        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          price: 10,
        };
        const row = [{ data: detail } as RowNode];

        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          netValue: 120,
          price: 12,
          gpi: 20,
          gpm: 80,
          discount: 20,
          rlm: -1.0417,
          priceDiff: -0.9294,
          priceSource: PriceSource.MANUAL,
        };

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.DISCOUNT,
          20,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).toHaveBeenCalledWith(20, ColumnFields.DISCOUNT, detail);
        expect(
          service['simulationService'].getAffectedKpi
        ).toHaveBeenCalledWith([{ key: 'gpi', value: 20 }], 'gpi');
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [simulatedDetail], ColumnFields.DISCOUNT);
      });
      test('should call updateStore for targetPrice simulation', () => {
        // given:
        service['simulationService'].updateStoreForSimulation = jest.fn();
        service['simulationService'].calculateAffectedKPIs = jest.fn(() => [
          { key: 'targetPrice', value: 100 },
        ]);
        service['simulationService'].getAffectedKpi = jest.fn(() => 100);
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          targetPrice: 10,
        };
        const row = [{ data: detail } as RowNode];

        const simulatedDetail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          targetPrice: 100,
        };

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.TARGET_PRICE,
          10,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).toHaveBeenCalledWith(10, ColumnFields.TARGET_PRICE, detail);
        expect(
          service['simulationService'].getAffectedKpi
        ).toHaveBeenCalledWith(
          [{ key: 'targetPrice', value: 100 }],
          'targetPrice'
        );
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(
          1234,
          [simulatedDetail],
          ColumnFields.TARGET_PRICE
        );
      });
    });
    describe('should not simulate', () => {
      beforeEach(() => {
        service['simulationService'].updateStoreForSimulation = jest.fn();
        service['simulationService'].calculateAffectedKPIs = jest.fn();
        service['simulationService'].getAffectedKpi = jest.fn();
      });
      test("should not simulate if discount is simulated and detail's sapGrossPrice is undefined", () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          sapGrossPrice: undefined,
        };

        const row = [
          {
            data: detail,
          } as RowNode,
        ];

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.DISCOUNT,
          10,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).not.toHaveBeenCalled();
        expect(
          service['simulationService'].getAffectedKpi
        ).not.toHaveBeenCalled();
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [detail], ColumnFields.DISCOUNT);
      });
      test("should not simulate if gpi is simulated and detail's gpc is undefined", () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          gpc: undefined,
        };

        const row = [
          {
            data: detail,
          } as RowNode,
        ];

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.GPI,
          10,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).not.toHaveBeenCalled();
        expect(
          service['simulationService'].getAffectedKpi
        ).not.toHaveBeenCalled();
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [detail], ColumnFields.GPI);
      });
      test("should not simulate if gpm is simulated and detail's sqv is undefined", () => {
        const detail: QuotationDetail = {
          ...QUOTATION_DETAIL_MOCK,
          sqv: undefined,
        };

        const row = [
          {
            data: detail,
          } as RowNode,
        ];

        // when:
        service.simulateSelectedQuotationDetails(
          ColumnFields.GPM,
          10,
          row,
          1234
        );

        // then:
        expect(
          service['simulationService'].calculateAffectedKPIs
        ).not.toHaveBeenCalled();
        expect(
          service['simulationService'].getAffectedKpi
        ).not.toHaveBeenCalled();
        expect(
          service['simulationService'].updateStoreForSimulation
        ).toHaveBeenCalledWith(1234, [detail], ColumnFields.GPM);
      });
    });
  });
});
