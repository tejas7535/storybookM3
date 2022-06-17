import {
  DialogResponseListValue,
  PreferredGreaseOption,
} from '@ga/shared/models';

/**
 * Convert dialog response list values into options for preferred grease
 * Defaults to empty array
 */
export const adaptPreferredGreaseOptionsFromDialogResponseListValues = (
  items: DialogResponseListValue[] = []
): PreferredGreaseOption[] =>
  items.length > 0
    ? items.map((item) => ({
        id: item?.id,
        text: item?.text,
      }))
    : [];
