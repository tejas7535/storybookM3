import * as utils from '../../../shared/table/column-utils';
import { COLUMN_DEFINITIONS } from './column-definitions';

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
  it('should call value getter and format methods', () => {
    const columnDefinitions = COLUMN_DEFINITIONS;

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
