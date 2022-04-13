import { ValueFormatterParams } from '@ag-grid-community/all-modules';

export const EMPTY_VALUE_FORMATTER = ({
  value,
}: ValueFormatterParams): string => (value ? value : '(Empty)');
