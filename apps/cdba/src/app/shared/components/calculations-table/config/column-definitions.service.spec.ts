import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';

import * as utils from '../../table/column-utils';
import { ColumnDefinitionService } from './column-definitions.service';

jest.mock('../../table/column-utils', () => ({
  ...jest.requireActual('../../table/column-utils'),
  valueGetterDate: jest.fn(),
  valueGetterArray: jest.fn(),
}));

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;
  let spectator: SpectatorService<ColumnDefinitionService>;

  const createService = createServiceFactory(ColumnDefinitionService);

  beforeEach(() => {
    spectator = createService();
    service = spectator.inject(ColumnDefinitionService);
  });

  it('should call value getter and format methods', () => {
    const columnDefinitions = service.COLUMN_DEFINITIONS;

    Object.keys(columnDefinitions).forEach((column) => {
      if (columnDefinitions[column].valueGetter) {
        const valueGetter = columnDefinitions[column].valueGetter as Function;
        valueGetter({ data: {} });
      }
    });

    expect(utils.valueGetterDate).toHaveBeenCalledTimes(1);
  });
});
