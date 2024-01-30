import { ValueFormatterParams } from 'ag-grid-community';

export const PERCENT_FORMATTER = ({
  value,
}: ValueFormatterParams<any, number>) => (value ? `${value} %` : undefined);
