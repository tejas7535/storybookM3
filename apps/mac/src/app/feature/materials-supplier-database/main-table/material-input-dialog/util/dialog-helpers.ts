import { ChangeDetectorRef, ElementRef, QueryList } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

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
      option.id &&
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
  if (errors.invalidSapId) {
    return getTranslatedError('invalidSapId');
  }

  return getTranslatedError('generic');
};

export const getTranslatedError = (key: string, params = {}): string =>
  translate(`materialsSupplierDatabase.mainTable.dialog.error.${key}`, params);

export const focusSelectedElement = (
  changes: QueryList<ElementRef>,
  column: string,
  cdRef: ChangeDetectorRef
): void => {
  const selectedItem: ElementRef = changes.find((item: ElementRef) =>
    item.nativeElement.name
      ? item.nativeElement.name === column
      : item.nativeElement.outerHTML.includes(`name="${column}"`)
  );

  if (!selectedItem) {
    return;
  }

  if (selectedItem.nativeElement.name) {
    selectedItem.nativeElement.focus();
  } else {
    selectedItem.nativeElement.scrollIntoView();
    const matSelect = selectedItem.nativeElement.querySelector('mat-select');
    const input = selectedItem.nativeElement.querySelector('input');
    if (matSelect) {
      matSelect.focus();
    } else if (input) {
      input.focus();
    } else {
      selectedItem.nativeElement.focus();
    }
  }
  cdRef.markForCheck();
  cdRef.detectChanges();
};

export const createSapSupplierIDValidator =
  (pattern: string): ValidatorFn =>
  (control: AbstractControl<StringOption[]>): ValidationErrors | null => {
    const value = control.value;
    if (!value) {
      return undefined;
    }
    const regexp = new RegExp(pattern);

    return value.some((v) => !regexp.test(v.title))
      ? { invalidSapId: true }
      : undefined;
  };
