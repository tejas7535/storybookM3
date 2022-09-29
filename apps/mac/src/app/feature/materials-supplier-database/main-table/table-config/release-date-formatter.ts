import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';

export const RELEASE_DATE_FORMATTER = ({
  value,
}: ValueFormatterParams<any, Date>) => {
  if (!value) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  return moment(value).format('MM/YY');
};
