import { ValueGetterParams } from '@ag-grid-community/all-modules';
import { ColumnUtilsService } from '@cdba/shared/components/table';
import { ValueGetterFunction } from '@cdba/testing/types';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import * as utils from '../../table/column-utils';
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
  });

  it('should call value getter and format methods', () => {
    const columnDefinitions = service.getColDef(false);

    columnDefinitions.forEach((column) => {
      if (column.valueGetter) {
        const valueGetter = column.valueGetter as ValueGetterFunction;
        valueGetter({ data: {} } as ValueGetterParams);
      }
    });

    expect(utils.valueGetterDate).toHaveBeenCalledTimes(1);
  });
});
