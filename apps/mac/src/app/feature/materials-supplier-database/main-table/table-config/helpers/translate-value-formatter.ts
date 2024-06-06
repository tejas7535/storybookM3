import { translate } from '@jsverse/transloco';
import { ValueFormatterParams } from 'ag-grid-community';

export const TRANSLATE_VALUE_FORMATTER_FACTORY =
  (translationPrefix?: string, toLowerCase?: boolean) =>
  (valueFormatterParams: ValueFormatterParams) =>
    valueFormatterParams.value || valueFormatterParams.value === 0
      ? translate(
          `${translationPrefix ?? ''}${
            translationPrefix && translationPrefix.length > 0 ? '.' : ''
          }${
            toLowerCase
              ? valueFormatterParams.value.toLowerCase()
              : valueFormatterParams.value
          }`
        )
      : undefined;
