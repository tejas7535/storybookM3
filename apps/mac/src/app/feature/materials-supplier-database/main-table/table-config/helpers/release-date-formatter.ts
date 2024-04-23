import { translate } from '@jsverse/transloco';
import { ValueFormatterParams } from 'ag-grid-community';
import moment from 'moment';

export const RELEASE_DATE_FORMATTER = ({
  value,
}: ValueFormatterParams<any, Date>) => {
  if (!value) {
    return translate(
      'materialsSupplierDatabase.mainTable.columns.releaseDateHistoric'
    );
  }

  return moment(value).format('MM/YY');
};
