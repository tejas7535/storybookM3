import {
  ValueFormatterParams,
  ValueGetterParams,
} from '@ag-grid-community/all-modules';
import { ColumnUtilsService } from '@cdba/shared/components/table';
import { ScrambleMaterialNumberPipe } from '@cdba/shared/pipes';
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

import { ColumnDefinitionService } from './column-definitions.service';

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
      mockProvider(ScrambleMaterialNumberPipe, {
        transform: jest.fn(() => ''),
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
    const columnDefinitions = service.COLUMN_DEFINITIONS_DEFAULT;
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

    expect(formatNumberSpy).toHaveBeenCalledTimes(3);
  });
});
