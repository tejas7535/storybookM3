import { FormControl } from '@angular/forms';

import { translate } from '@ngneat/transloco';

import { StringOption } from '@schaeffler/inputs';

export const getMonths = () => Array.from({ length: 12 }, (_, i) => i + 1);

export const getYears = () => {
  const curYear = new Date().getFullYear();

  return Array.from({ length: curYear - 2000 + 1 }, (_, i) => curYear - i);
};

export const filterFn = (option?: StringOption, value?: string) => {
  if (!value) {
    return true;
  }

  return option?.title
    ?.toLowerCase()
    .trim()
    .includes(value.toLowerCase().trim());
};

export const valueTitleToOptionKeyFilterFnFactory =
  (control: FormControl<StringOption>, dataKey: string) =>
  (option?: StringOption, value?: string) => {
    if (
      control.value &&
      control.value.title &&
      control.value.title !== option.data[dataKey]
    ) {
      return false;
    }

    return filterFn(option, value);
  };

export const valueOptionKeyToTitleFilterFnFactory =
  (control: FormControl<StringOption>, dataKey: string) =>
  (option?: StringOption, value?: string) => {
    if (
      control.value &&
      control.value.data &&
      control.value.data[dataKey] !== option.title
    ) {
      return false;
    }

    return filterFn(option, value);
  };

export const materialNameFilterFnFactory =
  (standardDocumentsControl: FormControl<StringOption>) =>
  (option?: StringOption, value?: string) => {
    if (
      standardDocumentsControl.value &&
      standardDocumentsControl.value.data &&
      !standardDocumentsControl.value.data['materialNames'].some(
        ({ materialName }: { materialName: string }) =>
          materialName === option.title
      )
    ) {
      return false;
    }

    return filterFn(option, value);
  };

export const standardDocumentFilterFnFactory =
  (materialNamesControl: FormControl<StringOption>) =>
  (option?: StringOption, value?: string) => {
    if (
      materialNamesControl.value &&
      materialNamesControl.value.data &&
      !materialNamesControl.value.data['standardDocuments'].some(
        ({ standardDocument }: { standardDocument: string }) =>
          standardDocument === option.title
      )
    ) {
      return false;
    }

    return filterFn(option, value);
  };

export const getErrorMessage = (errors: { [key: string]: any }): string => {
  if (errors.required) {
    return getTranslatedError('required');
  }
  if (errors.min) {
    return getTranslatedError('min', { min: errors.min.min });
  }
  if (errors.scopeTotalLowerThanSingleScopes) {
    return getTranslatedError('co2TooLowShort', {
      min: errors.scopeTotalLowerThanSingleScopes.min,
    });
  }

  return getTranslatedError('generic');
};

export const getTranslatedError = (key: string, params = {}): string =>
  translate(`materialsSupplierDatabase.mainTable.dialog.error.${key}`, params);
