import { COLUMN_DEFINITIONS } from './column-definitions';
import * as utils from './column-utils';

jest.mock('@ngneat/transloco', () => ({
  ...jest.requireActual('@ngneat/transloco'),
  translate: jest.fn(() => 'translate it'),
}));

jest.mock('./column-utils', () => ({
  ...jest.requireActual('./column-utils'),
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

    expect(utils.valueGetterArray).toHaveBeenCalledTimes(13);
    expect(utils.valueGetterDate).toHaveBeenCalledTimes(5);
  });
});
