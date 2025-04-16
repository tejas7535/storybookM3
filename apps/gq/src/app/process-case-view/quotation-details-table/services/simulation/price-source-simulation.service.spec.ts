import { PriceSourceOptions } from '@gq/shared/ag-grid/column-headers/extended-column-header/models/price-source-options.enum';
import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { IRowNode } from 'ag-grid-enterprise';

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
    test('should call perform simulation', () => {
      const priceSourceOption = PriceSourceOptions.GQ;
      const gqId = 1;
      const selectedRows = [{ id: '1' }] as IRowNode[] as any[];

      const selectedDetails = selectedRows.map((row) => row.data);
      const performSimulationSpy = jest.spyOn(
        service['simulationService'],
        'performSimulation'
      );

      service.onPriceSourceSimulation(priceSourceOption, gqId, selectedRows);

      expect(performSimulationSpy).toHaveBeenCalledWith(
        gqId,
        ColumnFields.PRICE_SOURCE,
        null,
        priceSourceOption,
        selectedDetails
      );
    });
  });
});
