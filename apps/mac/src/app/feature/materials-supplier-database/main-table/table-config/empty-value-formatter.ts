import { ValueFormatterParams } from 'ag-grid-community';

export const EMPTY_VALUE_FORMATTER = ({
  value,
}: ValueFormatterParams): string => value ?? '(Empty)';
