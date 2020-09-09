import * as utils from '../../table/column-utils';
import { COLUMN_DEFINITIONS } from './column-definitions';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

jest.mock('../../table/column-utils', () => ({
  ...jest.requireActual('../../table/column-utils'),
  valueGetterDate: jest.fn(),
  valueGetterArray: jest.fn(),
}));

describe('ColumnDefinitions', () => {
  it('should call value getter methods', () => {
    const columnDefinitions = COLUMN_DEFINITIONS;

    Object.keys(columnDefinitions).forEach((column) => {
      if (columnDefinitions[column].valueGetter) {
        const valueGetter = columnDefinitions[column].valueGetter as Function;
        valueGetter({ data: {} });
      }
    });

    expect(utils.valueGetterDate).toHaveBeenCalledTimes(1);
  });
});
