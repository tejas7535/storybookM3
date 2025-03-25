/* eslint-disable max-lines */
import { Params } from '@angular/router';

import { FILTER_PARAM_INDICATOR, LOCALE_DE } from '@gq/shared/constants';
import {
  Duration,
  Keyboard,
  QuotationStatus,
  SAP_SYNC_STATUS,
  TagType,
} from '@gq/shared/models';
import { SelectableValue } from '@gq/shared/models/selectable-value.model';
// eslint-disable-next-line unicorn/prefer-node-protocol
import moment from 'moment';

import { ColumnFields } from '../ag-grid/constants/column-fields.enum';
import { FilterNames } from '../components/autocomplete-input/filter-names.enum';
import { SearchbarGridContext } from '../components/global-search-bar/config/searchbar-grid-context.interface';
import { MaterialsCriteriaSelection } from '../components/global-search-bar/materials-result-table/material-criteria-selection.enum';
import { TargetPriceSource } from '../models/quotation/target-price-source.enum';
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

export const getTagTypeByStatus = (
  status: QuotationStatus | SAP_SYNC_STATUS
): TagType => {
  switch (status) {
    case QuotationStatus.IN_APPROVAL:
    case SAP_SYNC_STATUS.SYNCED: {
      return TagType.INFO;
    }
    case QuotationStatus.APPROVED: {
      return TagType.SUCCESS;
    }

    case QuotationStatus.REJECTED:
    case SAP_SYNC_STATUS.SYNC_FAILED: {
      return TagType.ERROR;
    }

    case SAP_SYNC_STATUS.NOT_SYNCED: {
      return TagType.NEUTRAL;
    }
    case SAP_SYNC_STATUS.SYNC_PENDING:
    case SAP_SYNC_STATUS.PARTIALLY_SYNCED: {
      return TagType.WARNING;
    }

    default: {
      return TagType.INFO;
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
        deliveryUnit: matAutocomplete.deliveryUnit,
        uom: matAutocomplete.unitOfMeasurement,
      } as IdValue;
    }

    case FilterNames.MATERIAL_DESCRIPTION: {
      return {
        id: matAutocomplete.materialDescription,
        value: matAutocomplete.materialNumber15,
        value2: matAutocomplete.customerMaterial,
        selected: false,
        deliveryUnit: matAutocomplete.deliveryUnit,
        uom: matAutocomplete.unitOfMeasurement,
      } as IdValue;
    }

    case FilterNames.CUSTOMER_MATERIAL: {
      return {
        id: matAutocomplete.customerMaterial,
        value: matAutocomplete.materialNumber15,
        value2: matAutocomplete.materialDescription,
        selected: false,
        deliveryUnit: matAutocomplete.deliveryUnit,
        uom: matAutocomplete.unitOfMeasurement,
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
        deliveryUnit: idValueOption.deliveryUnit,
        unitOfMeasurement: idValueOption.uom,
      };
    }
    case FilterNames.MATERIAL_DESCRIPTION: {
      return {
        customerMaterial: idValueOption.value2,
        materialDescription: idValueOption.id,
        materialNumber15: idValueOption.value,
        deliveryUnit: idValueOption.deliveryUnit,
        unitOfMeasurement: idValueOption.uom,
      };
    }
    case FilterNames.CUSTOMER_MATERIAL: {
      return {
        customerMaterial: idValueOption.id,
        materialDescription: idValueOption.value2,
        materialNumber15: idValueOption.value,
        deliveryUnit: idValueOption.deliveryUnit,
        unitOfMeasurement: idValueOption.uom,
      };
    }
    default: {
      return null;
    }
  }
};

/**
 * get the next higher possible multiple of a base value and a multiple
 *
 * @param value the base value to check whether it is a multiple of the multiple
 * @param multiple the multiple to check
 * @returns return the next possible multiple, of base value and multiple
 */
export const getNextHigherPossibleMultiple = (
  value: number,
  multiple: number
): number => {
  const nextMultiple = value && value > multiple ? value : multiple;

  if (nextMultiple && multiple) {
    return Math.ceil(nextMultiple / multiple) * multiple;
  }

  return value;
};

/**
 * get the next lower possible multiple of a base value and a multiple
 *
 * @param value the base value to check whether it is a multiple of the multiple
 * @param multiple the multiple to check
 * @returns return the next lower possible multiple, of base value and multiple
 */
export const getNextLowerPossibleMultiple = (
  value: number,
  multiple: number
): number => {
  if (value && multiple) {
    return Math.floor(value / multiple) * multiple;
  }

  return value;
};

export const getTargetPriceSourceValue = (
  targetPrice: any,
  targetPriceFormControlValid: boolean,
  targetPriceSourceValue: TargetPriceSource
): TargetPriceSource => {
  if (
    targetPrice &&
    (targetPriceSourceValue === TargetPriceSource.NO_ENTRY ||
      targetPriceSourceValue === undefined) &&
    targetPriceFormControlValid
  ) {
    return TargetPriceSource.INTERNAL;
  }
  if (!targetPrice || targetPrice === '') {
    return TargetPriceSource.NO_ENTRY;
  }

  return targetPriceSourceValue ?? TargetPriceSource.NO_ENTRY;
};

export const getTargetPriceValue = (
  targetPriceSourceValue: any,
  targetPriceValue: number | string
): number | string => {
  if (
    (targetPriceSourceValue === TargetPriceSource.NO_ENTRY ||
      targetPriceSourceValue === undefined) &&
    targetPriceValue
  ) {
    return null;
  }

  return targetPriceValue;
};

export const displaySelectableValue = (value: SelectableValue) => {
  if (!value) {
    return '';
  }

  if (value.value2) {
    return `${value.id} | ${value.value} | ${value.value2}`;
  }

  return `${value.id} | ${value.value}`;
};
