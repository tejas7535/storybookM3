import { DecimalPipe } from '@angular/common';
import { Injectable } from '@angular/core';

import { StatusPanelDef } from '@ag-grid-community/core';
import { ColDef } from '@ag-grid-enterprise/all-modules';

import { PLsAndSeries } from '../../../core/store/reducers/create-case/models/pls-and-series.model';
import { LOCALE_DE } from '../../constants';
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

  static transformDate(
    date: string,
    formatLocale?: string,
    formatOptions?: Intl.DateTimeFormatOptions
  ): string {
    if (!date) {
      return '';
    }

    return new Intl.DateTimeFormat(
      formatLocale || 'de-DE',
      formatOptions || {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }
    ).format(new Date(date));
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

  static parseLocalizedInputValue(val: string, locale: string): number {
    if (!val) {
      return 0;
    }
    const isGermanLocale = locale === LOCALE_DE.id;

    const value = isGermanLocale
      ? val.replace(/\./g, Keyboard.EMPTY).replace(/,/g, Keyboard.DOT)
      : val.replace(/,/g, Keyboard.EMPTY);

    return Number.parseFloat(value);
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
}

const isPaste = (event: KeyboardEvent): boolean =>
  (event.ctrlKey && event.key === 'v') || (event.metaKey && event.key === 'v'); // support for macOs
