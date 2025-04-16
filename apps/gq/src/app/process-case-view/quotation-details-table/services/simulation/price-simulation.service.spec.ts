import { ColumnFields } from '@gq/shared/ag-grid/constants/column-fields.enum';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { IRowNode } from 'ag-grid-enterprise';

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
    test('should call perform simulation', () => {
      const simulatedField = ColumnFields.PRICE;
      const gqId = 1;
      const simulatedValue = 10;
      const selectedRows = [{ id: '1' }] as IRowNode[] as any[];

      const selectedDetails = selectedRows.map((row) => row.data);
      const performSimulationSpy = jest.spyOn(
        service['simulationService'],
        'performSimulation'
      );

      service.simulateSelectedQuotationDetails(
        simulatedField,
        simulatedValue,
        selectedRows,
        gqId
      );

      expect(performSimulationSpy).toHaveBeenCalledWith(
        gqId,
        simulatedField,
        simulatedValue,
        null,
        selectedDetails
      );
    });
  });
});
