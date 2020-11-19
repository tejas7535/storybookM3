import { TestBed } from '@angular/core/testing';

import { configureTestSuite } from 'ng-bullet';

import { provideTranslocoTestingModule } from '@schaeffler/transloco';

import * as utils from '../../../shared/table/column-utils';
import { ColumnDefinitionService } from './column-definitions.service';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

jest.mock('../../../shared/table/column-utils', () => ({
  ...jest.requireActual('../../../shared/table/column-utils'),
  valueGetterDate: jest.fn(),
  valueGetterArray: jest.fn(),
  formatNumber: jest.fn(),
}));

describe('ColumnDefinitions', () => {
  let service: ColumnDefinitionService;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [provideTranslocoTestingModule({})],
      providers: [ColumnDefinitionService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(ColumnDefinitionService);
  });

  it('should call value getter and format methods', () => {
    const columnDefinitions = service.COLUMN_DEFINITIONS;

    Object.keys(columnDefinitions).forEach((column) => {
      if (columnDefinitions[column].valueGetter) {
        const valueGetter = columnDefinitions[column].valueGetter as Function;
        valueGetter({ data: {} });
      }

      if (columnDefinitions[column].valueFormatter) {
        const valueFormatter = columnDefinitions[column]
          .valueFormatter as Function;
        valueFormatter({ data: {} });
      }
    });

    expect(utils.valueGetterArray).toHaveBeenCalledTimes(10);
    expect(utils.valueGetterDate).toHaveBeenCalledTimes(5);
    expect(utils.formatNumber).toHaveBeenCalledTimes(22);
  });
});
