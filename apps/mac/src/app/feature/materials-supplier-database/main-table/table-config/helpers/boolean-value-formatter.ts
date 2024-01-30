import { translate } from '@ngneat/transloco';
import { ValueFormatterParams } from 'ag-grid-community';

export const BOOLEAN_VALUE_FORMATTER = ({ value }: ValueFormatterParams) => {
  let result;

  if (value !== undefined && value !== null) {
    result =
      // The value formatter is used as a filterValueFormatter, too, where the value is of type string and not boolean.
      value.toString() === 'true'
        ? translate('materialsSupplierDatabase.mainTable.yes')
        : translate('materialsSupplierDatabase.mainTable.no');
  }

  return result;
};
