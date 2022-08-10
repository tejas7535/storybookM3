import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';
import { ValueFormatterParams } from 'ag-grid-community';

import { ColumnUtilsService } from '@cdba/shared/components/table';
import { ValueFormatterFunction } from '@cdba/testing/types';

import { ColumnDefinitionService } from './column-definitions.service';

jest.mock('../../table/column-utils', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>('../../table/column-utils'),
  valueGetterDate: jest.fn(),
  valueGetterArray: jest.fn(),
}));

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;

  let columnUtilsService: ColumnUtilsService;

  const createService = createServiceFactory({
    service: ColumnDefinitionService,
    providers: [
      mockProvider(ColumnUtilsService, {
        formatNumber: jest.fn(() => ''),
        formatDate: jest.fn(() => ''),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ColumnDefinitionService);

    columnUtilsService = spectator.inject(ColumnUtilsService);
  });

  it('should call value getter and format methods', () => {
    const columnDefinitions = service.getColDef();

    columnDefinitions.forEach((column) => {
      if (column.valueFormatter) {
        const valueFormatter = column.valueFormatter as ValueFormatterFunction;
        valueFormatter({ data: {} } as ValueFormatterParams);
      }
    });

    expect(columnUtilsService.formatNumber).toHaveBeenCalledTimes(3);
  });
});
