import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/all-modules';
import { ColumnUtilsService } from '@cdba/shared/components/table';
import {
  ValueFormatterFunction,
  ValueGetterFunction,
} from '@cdba/testing/types';
import {
  createServiceFactory,
  mockProvider,
  SpectatorService,
} from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco/testing';

import * as utils from '../../../shared/components/table/column-utils';
import { ColumnDefinitionService } from './column-definitions.service';

jest.mock('../../../shared/components/table/column-utils', () => ({
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-arguments
  ...jest.requireActual<any>('../../../shared/components/table/column-utils'),
  valueGetterDate: jest.fn(),
  valueGetterArray: jest.fn(),
  formatNumber: jest.fn(),
}));

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;

  const createService = createServiceFactory({
    service: ColumnDefinitionService,
    imports: [provideTranslocoTestingModule({ en: {} })],
    providers: [
      mockProvider(ColumnUtilsService, {
        formatNumber: jest.fn(() => ''),
        formatDate: jest.fn(() => ''),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.service;
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should call value getter and format methods', () => {
    const columnDefinitions = service.COLUMN_DEFINITIONS;
    const formatNumberSpy = jest.spyOn(
      service['columnUtilsService'],
      'formatNumber'
    );

    columnDefinitions.forEach((column) => {
      if (column.valueGetter) {
        const valueGetter = column.valueGetter as ValueGetterFunction;
        valueGetter({ data: {} } as ValueGetterParams);
      }

      if (column.valueFormatter) {
        const valueFormatter = column.valueFormatter as ValueFormatterFunction;
        valueFormatter({ data: {} } as ValueFormatterParams);
      }
    });

    expect(utils.valueGetterArray).toHaveBeenCalledTimes(10);
    expect(utils.valueGetterDate).toHaveBeenCalledTimes(5);
    expect(formatNumberSpy).toHaveBeenCalledTimes(23);
  });
});
