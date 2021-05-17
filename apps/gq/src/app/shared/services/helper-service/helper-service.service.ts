import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { KeyName } from '@ag-grid-community/all-modules';
import { ColDef, StatusPanelDef } from '@ag-grid-community/core';

import { StatusBarConfig } from '../../models/table';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getLastYear(): number {
    return HelperService.getCurrentYear() - 1;
  }

  static transformNumber(number: number, showDigits: boolean): string {
    const pipe = new DecimalPipe('en');

    return pipe.transform(number, showDigits ? '.2-2' : '');
  }

  static transformNumberCurrency(number: string, currency: string): string {
    return number ? `${number} ${currency}` : `-`;
  }

  static transformMarginDetails(value: number, currency: string): string {
    const transformedNumber = HelperService.transformNumber(value, true);

    return HelperService.transformNumberCurrency(transformedNumber, currency);
  }
  static transformPercentage(percentage: number): string {
    return percentage ? `${percentage} %` : '-';
  }

  static initStatusBar(
    isCaseView: boolean,
    statusBar: StatusBarConfig
  ): StatusBarConfig {
    const addPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? 'createCaseButtonComponent'
        : 'addMaterialButtonComponent',
      align: 'left',
    };

    const resetPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? 'createCaseResetAllComponent'
        : 'processCaseResetAllComponent',
      align: 'right',
    };

    return { statusPanels: [...statusBar.statusPanels, addPanel, resetPanel] };
  }

  static initColDef(isCaseView: boolean, colDef: ColDef[]): ColDef[] {
    const actionCell: ColDef = {
      cellRenderer: isCaseView
        ? 'createCaseActionCellComponent'
        : 'processCaseActionCellComponent',
      flex: 0.1,
    };

    return [...colDef, actionCell];
  }
  static validateNumberInputKeyPress(
    event: KeyboardEvent,
    manualPriceInput: { value: number }
  ): void {
    const parsedInput = parseInt(event.key, 10);
    const isValidNumber = parsedInput === 0 || !isNaN(parsedInput);
    const inputIsAllowedSpecialKey = [
      KeyName.BACKSPACE,
      KeyName.DELETE,
      '.',
    ].includes(event.key);

    if (event.key === ',' || (!isValidNumber && !inputIsAllowedSpecialKey)) {
      event.preventDefault();
    } else {
      const { value } = manualPriceInput;
      // get all decimal digits for the input value
      const decimalDigits = value ? value.toString().split('.') : [];

      // prevent user from entering a third decimal place
      if (decimalDigits[1]?.length > 1 && !inputIsAllowedSpecialKey) {
        event.preventDefault();
      }
    }
  }

  static validateNumberInputPaste(
    event: ClipboardEvent,
    formControl: FormControl
  ) {
    event.preventDefault();
    const price =
      Math.round(parseFloat(event.clipboardData.getData('text')) * 100) / 100;

    if (price) {
      formControl.setValue(price);
    }
  }
}
