import { Params } from '@angular/router';

import { FILTER_PARAM_INDICATOR, LOCALE_DE } from '@gq/shared/constants';
import {
  Duration,
  Keyboard,
  QuotationStatus,
  SAP_SYNC_STATUS,
} from '@gq/shared/models';
// eslint-disable-next-line unicorn/prefer-node-protocol
import moment from 'moment';

import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { FilterNames } from '../components/autocomplete-input/filter-names.enum';
import { SearchbarGridContext } from '../components/global-search-bar/config/searchbar-grid-context.interface';
import { MaterialsCriteriaSelection } from '../components/global-search-bar/materials-result-table/material-criteria-selection.enum';
import { Rating } from '../models/rating.enum';
import { IdValue } from '../models/search/id-value.model';
import { MaterialAutoComplete } from '../services/rest/material/models';
export const getCurrentYear = (): number => new Date().getFullYear();

export const getLastYear = (): number => getCurrentYear() - 1;

/**
 * Calculate the duration between the given start and end date.
 * time of the dates is ignored.
 *
 * @param startDate start date as ISO string
 * @param endDate end date as ISO string
 * @returns an object, describing the duration
 */
export const calculateDuration = (
  startDate: string,
  endDate: string,
  locale: string
): Duration => {
  if (!startDate || !endDate) {
    return undefined;
  }
  moment.locale(locale);

  const startDay = moment(
    moment(startDate).locale(locale).format('YYYY-MM-DD')
  );
  const endDay = moment(moment(endDate).locale(locale).format('YYYY-MM-DD'));

  const difference = endDay.diff(startDay);
  const duration = moment.duration(difference);

  //
  // when switch from summer to winter time, there's technically one hour "too much" for a complete day (expectedDays as expected  and duration.hours() => 1),
  // => ****so we will ignore it****
  // isDST => isDaylightSavingTime (summer time)
  if (!startDay.isDST() && endDay.isDST()) {
    duration.add(1, 'day');
  }

  return {
    years: duration.years(),
    months: duration.months(),
    days: duration.days(),
  };
};

export const getMomentUtcStartOfDayDate = (date: string): moment.Moment =>
  moment(date).utc().startOf('day');

export const parseLocalizedInputValue = (
  val: string,
  locale: string
): number => {
  if (!val) {
    return 0;
  }
  const isGermanLocale = locale === LOCALE_DE.id;

  const value = isGermanLocale
    ? val.replaceAll('.', Keyboard.EMPTY).replaceAll(',', Keyboard.DOT)
    : val.replaceAll(',', Keyboard.EMPTY);

  return Number.parseFloat(value);
};

export const parseNullableLocalizedInputValue = (
  val: string,
  locale: string
): number => {
  if (!val) {
    return undefined;
  }
  const isGermanLocale = locale === LOCALE_DE.id;

  const value = isGermanLocale
    ? val.replaceAll('.', Keyboard.EMPTY).replaceAll(',', Keyboard.DOT)
    : val.replaceAll(',', Keyboard.EMPTY);

  return Number.parseFloat(value);
};

export const validateQuantityInputKeyPress = (event: KeyboardEvent): void => {
  const inputIsAllowedSpecialKey =
    Keyboard.BACKSPACE === event.key ||
    Keyboard.DELETE === event.key ||
    Keyboard.TAB === event.key;

  if (
    Number.isNaN(Number.parseInt(event.key, 10)) &&
    !inputIsAllowedSpecialKey &&
    !isPaste(event)
  ) {
    event.preventDefault();
  }
};

const isPaste = (event: KeyboardEvent): boolean =>
  (event.ctrlKey && event.key === 'v') || (event.metaKey && event.key === 'v'); // support for macOs

export function getRatingText(rating: number): string {
  return Rating[rating];
}

export function groupBy<T>(arr: T[], fn: (item: T) => any) {
  const groupedBy = new Map();
  for (const listItem of arr) {
    if (groupedBy.has(fn(listItem))) {
      groupedBy.get(fn(listItem)).push(listItem);
    } else {
      groupedBy.set(fn(listItem), [listItem]);
    }
  }

  return groupedBy;
}

/**
 * getFilterQueryParams when the context has property filter
 * filter is applied only for materials Tab, when row is doubleClicked, openedByContextMenu or opened by click on GqId link
 *
 * @param context context of the grid typeof SearchbarGridContext
 * @param queryParams already calculated query params
 * @param data data from params.node.data typeof either GetContextMenuItemsParams or RowDoubleClickedEvent or ViewQuotation
 */
export const addMaterialFilterToQueryParams = (
  queryParams: Params,
  context: SearchbarGridContext,
  data: any
): void => {
  switch (context?.filter) {
    case MaterialsCriteriaSelection.MATERIAL_NUMBER: {
      queryParams[
        `${FILTER_PARAM_INDICATOR}${ColumnFields.MATERIAL_NUMBER_15}`
      ] = context.columnUtilityService.materialTransform({
        value: data.materialNumber15,
      } as any);

      break;
    }
    case MaterialsCriteriaSelection.MATERIAL_DESCRIPTION: {
      queryParams[
        `${FILTER_PARAM_INDICATOR}${ColumnFields.MATERIAL_DESCRIPTION}`
      ] = data.materialDescription;

      break;
    }
    case MaterialsCriteriaSelection.CUSTOMER_MATERIAL_NUMBER: {
      queryParams[
        `${FILTER_PARAM_INDICATOR}${ColumnFields.CUSTOMER_MATERIAL}`
      ] = data.customerMaterial;

      break;
    }
    default: {
      break;
    }
  }
};
export type TagType =
  | 'error'
  | 'primary'
  | 'info'
  | 'warning'
  | 'success'
  | 'neutral'
  | 'category2'
  | 'category3';
export const getTagTypeByStatus = (
  status: QuotationStatus | SAP_SYNC_STATUS
): TagType => {
  switch (status) {
    case QuotationStatus.IN_APPROVAL:
    case SAP_SYNC_STATUS.SYNCED: {
      return 'info';
    }
    case QuotationStatus.APPROVED: {
      return 'success';
    }

    case QuotationStatus.REJECTED:
    case SAP_SYNC_STATUS.SYNC_FAILED: {
      return 'error';
    }

    case SAP_SYNC_STATUS.NOT_SYNCED: {
      return 'neutral';
    }
    case SAP_SYNC_STATUS.SYNC_PENDING:
    case SAP_SYNC_STATUS.PARTIALLY_SYNCED: {
      return 'warning';
    }

    default: {
      return 'info';
    }
  }
};

export const mapMaterialAutocompleteToIdValue = (
  matAutocomplete: MaterialAutoComplete,
  filter: string
): IdValue => {
  switch (filter) {
    case FilterNames.MATERIAL_NUMBER: {
      return {
        id: matAutocomplete.materialNumber15,
        value: matAutocomplete.materialDescription,
        value2: matAutocomplete.customerMaterial,
        selected: false,
      } as IdValue;
    }

    case FilterNames.MATERIAL_DESCRIPTION: {
      return {
        id: matAutocomplete.materialDescription,
        value: matAutocomplete.materialNumber15,
        value2: matAutocomplete.customerMaterial,
        selected: false,
      } as IdValue;
    }

    case FilterNames.CUSTOMER_MATERIAL: {
      return {
        id: matAutocomplete.customerMaterial,
        value: matAutocomplete.materialNumber15,
        value2: matAutocomplete.materialDescription,
        selected: false,
      } as IdValue;
    }

    default: {
      return null;
    }
  }
};

export const mapIdValueToMaterialAutoComplete = (
  idValueOption: IdValue,
  filter: string
): MaterialAutoComplete => {
  switch (filter) {
    // convert Option to more readable MaterialAutoComplete
    case FilterNames.MATERIAL_NUMBER: {
      return {
        customerMaterial: idValueOption.value2,
        materialDescription: idValueOption.value,
        materialNumber15: idValueOption.id,
      };
    }
    case FilterNames.MATERIAL_DESCRIPTION: {
      return {
        customerMaterial: idValueOption.value2,
        materialDescription: idValueOption.id,
        materialNumber15: idValueOption.value,
      };
    }
    case FilterNames.CUSTOMER_MATERIAL: {
      return {
        customerMaterial: idValueOption.id,
        materialDescription: idValueOption.value2,
        materialNumber15: idValueOption.value,
      };
    }
    default: {
      return null;
    }
  }
};
