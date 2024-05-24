import { ValueFormatterParams } from 'ag-grid-community';

export const ARRAY_SORT_VALUE_FORMATTER = ({
  value,
}: ValueFormatterParams<unknown, number[]>) =>
  value && value.length > 0
    ? [...value].sort((a, b) => a - b).join(', ')
    : undefined;
