import { SapValueWithText } from '../../models';
import { DISTINCT_WITH_NAME_VALUE_GETTER_FACTORY } from './helpers';
import { REMOTE_SET_FILTER_PARAMS } from './remote-set-filter-params';

export const DISTINCT_WITH_NAME_FILTER_PARAMS_FACTORY = (
  textColumn: string
) => ({
  ...REMOTE_SET_FILTER_PARAMS,
  values: DISTINCT_WITH_NAME_VALUE_GETTER_FACTORY(textColumn),
  valueFormatter: ({ value }: { value: SapValueWithText }) =>
    `${value.value}${value.text ? ` (${value.text})` : ''}`,
  keyCreator: ({ value }: { value: SapValueWithText }) => value.value,
  comparator: (a: SapValueWithText, b: SapValueWithText) => {
    if (a.value < b.value) {
      return -1;
    } else if (a.value > b.value) {
      return 1;
    }

    return 0;
  },
});
