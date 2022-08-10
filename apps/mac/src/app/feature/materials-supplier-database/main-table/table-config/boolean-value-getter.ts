import { ValueGetterParams } from 'ag-grid-community';

export const BOOLEAN_VALUE_GETTER = (valueGetterParams: ValueGetterParams) =>
  valueGetterParams.getValue(valueGetterParams.column.getId()).toString();
