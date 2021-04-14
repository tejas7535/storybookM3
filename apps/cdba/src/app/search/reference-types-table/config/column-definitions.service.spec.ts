import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as utils from '../../../shared/components/table/column-utils';
import { ColumnDefinitionService } from './column-definitions.service';

jest.mock('../../../shared/components/table/column-utils', () => ({
  ...jest.requireActual('../../../shared/components/table/column-utils'),
  valueGetterDate: jest.fn(),
  valueGetterArray: jest.fn(),
  formatNumber: jest.fn(),
}));

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;

  const createService = createServiceFactory({
    service: ColumnDefinitionService,
    imports: [provideTranslocoTestingModule({})],
    providers: [ColumnDefinitionService],
  });

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ColumnDefinitionService);
  });

  it('should call value getter and format methods', () => {
    const columnDefinitions = service.COLUMN_DEFINITIONS;

    columnDefinitions.forEach((column) => {
      if (column.valueGetter) {
        const valueGetter = column.valueGetter as Function;
        valueGetter({ data: {} });
      }

      if (column.valueFormatter) {
        const valueFormatter = column.valueFormatter as Function;
        valueFormatter({ data: {} });
      }
    });

    expect(utils.valueGetterArray).toHaveBeenCalledTimes(10);
    expect(utils.valueGetterDate).toHaveBeenCalledTimes(5);
    expect(utils.formatNumber).toHaveBeenCalledTimes(22);
  });
});
