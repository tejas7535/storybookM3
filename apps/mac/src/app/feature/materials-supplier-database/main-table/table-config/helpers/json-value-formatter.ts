import { translate } from '@jsverse/transloco';
import { ITooltipParams, ValueFormatterParams } from 'ag-grid-community';

export const JSON_VALUE_FORMATTER_FACTORY =
  (translationPrefix?: string) =>
  (valueFormatterParams: ValueFormatterParams) => {
    if (!valueFormatterParams.value) {
      return '';
    }

    let keys = Object.keys(valueFormatterParams.value);
    if (translationPrefix) {
      keys = keys.map((key) => translate(`${translationPrefix}.${key}`));
    }

    return keys.join(' / ');
  };

export const JSON_VALUE_TOOLTIP_FORMATTER = (
  valueFormatterParams: ITooltipParams
) => {
  if (!valueFormatterParams.value) {
    return '';
  }
  const keys = Object.keys(valueFormatterParams.value);

  return keys.map((key) => valueFormatterParams.value[key]).join(' / ');
};
