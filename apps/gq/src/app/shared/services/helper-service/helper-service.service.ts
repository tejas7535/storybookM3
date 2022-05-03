import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

import { StatusPanelDef } from '@ag-grid-community/core';
import { ColDef } from '@ag-grid-enterprise/all-modules';

import { PLsAndSeries } from '../../../core/store/reducers/create-case/models/pls-and-series.model';
import { Keyboard } from '../../models';
import { StatusBarConfig } from '../../models/table';
import { PriceService } from '../price-service/price.service';
import { PLsSeriesResponse } from '../rest-services/search-service/models/pls-series-response.model';

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
    return number ? `${number} ${currency}` : Keyboard.DASH;
  }

  static transformMarginDetails(value: number, currency: string): string {
    const transformedNumber = HelperService.transformNumber(value, true);

    return HelperService.transformNumberCurrency(transformedNumber, currency);
  }
  static transformPercentage(percentage: number): string {
    return percentage
      ? `${PriceService.roundToTwoDecimals(percentage)} %`
      : Keyboard.DASH;
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
    manualPriceInput: HTMLInputElement
  ): void {
    this.validateNumberInput(
      event,
      manualPriceInput,
      [Keyboard.BACKSPACE, Keyboard.DELETE, Keyboard.DOT, Keyboard.DASH],
      2
    );
  }

  static validateAbsolutePriceInputKeyPress(
    event: KeyboardEvent,
    absolutePriceInput: HTMLInputElement
  ): void {
    this.validateNumberInput(
      event,
      absolutePriceInput,
      [Keyboard.BACKSPACE, Keyboard.DELETE, Keyboard.DOT],
      20
    );
  }

  static validateNumberInput(
    event: KeyboardEvent,
    inputElem: HTMLInputElement,
    allowdKeys: Keyboard[],
    numDigits: number
  ) {
    const parsedInput = Number.parseInt(event.key, 10);
    const isValidNumber = parsedInput === 0 || !Number.isNaN(parsedInput);
    // Allowed keys besides numbers
    const inputIsAllowedSpecialKey = allowdKeys.includes(event.key as Keyboard);

    if (
      // prevent on invalid number
      (!isValidNumber && !inputIsAllowedSpecialKey && !isPaste(event)) ||
      // prevent more than two decimal places
      ((inputElem.value + event.key)
        .toString()
        .replace(Keyboard.DASH, Keyboard.EMPTY)
        .split(Keyboard.DOT)[0].length > numDigits &&
        !inputIsAllowedSpecialKey &&
        !isPaste(event)) ||
      // prevent dot and dash expect for first char and digits
      ([Keyboard.DOT, Keyboard.DASH].some((char) =>
        inputElem.value.startsWith(char)
      ) &&
        [Keyboard.DOT, Keyboard.DASH].includes(event.key as Keyboard) &&
        inputElem.value.length === 1) ||
      (inputElem.value.length > 1 && event.key === Keyboard.DASH)
    ) {
      event.preventDefault();
    } else {
      const { value } = inputElem;
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
    formControl: FormControl,
    percentage: boolean
  ) {
    event.preventDefault();
    const price =
      Math.round(Number.parseFloat(event.clipboardData.getData('text')) * 100) /
      100;

    if (!Number.isNaN(price) && (price < 100 || !percentage)) {
      formControl.setValue(price);
    }
  }

  static transformPLsAndSeriesResponse(
    response: PLsSeriesResponse[]
  ): PLsAndSeries {
    const series = [...new Set(response.map((item) => item.series))].map(
      (el) => ({ value: el, selected: true })
    );
    const plsAndSeries: PLsAndSeries = {
      series,
      pls: [],
    };

    response.forEach((element) => {
      const index = plsAndSeries.pls.findIndex(
        (item) => item.value === element.productLineId
      );
      if (index < 0) {
        plsAndSeries.pls.push({
          value: element.productLineId,
          name: element.productLine,
          selected: true,
          series: [element.series],
        });
      } else if (!plsAndSeries.pls[index].series.includes(element.series)) {
        plsAndSeries.pls[index].series.push(element.series);
      }
    });

    return plsAndSeries;
  }

  static validateQuantityInputKeyPress(event: KeyboardEvent): void {
    const inputIsAllowedSpecialKey =
      Keyboard.BACKSPACE === event.key || Keyboard.DELETE === event.key;

    if (
      Number.isNaN(Number.parseInt(event.key, 10)) &&
      !inputIsAllowedSpecialKey &&
      !isPaste(event)
    ) {
      event.preventDefault();
    }
  }

  static validateQuantityInputPaste(event: ClipboardEvent): void {
    const quantity = Number.parseFloat(event.clipboardData.getData('text'));
    if (Number.isNaN(quantity) || !Number.isInteger(quantity)) {
      event.preventDefault();
    }
  }
}

const isPaste = (event: KeyboardEvent): boolean =>
  (event.ctrlKey && event.key === 'v') || (event.metaKey && event.key === 'v'); // support for macOs
