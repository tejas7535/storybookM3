import { Injectable } from '@angular/core';

import {
  TranslocoCurrencyPipe,
  TranslocoDatePipe,
  TranslocoDecimalPipe,
  TranslocoPercentPipe,
} from '@ngneat/transloco-locale';
import { StatusPanelDef } from 'ag-grid-community';
import { ColDef } from 'ag-grid-enterprise';

import { PLsAndSeries } from '../../../core/store/reducers/create-case/models/pls-and-series.model';
import { CreateCaseActionCellComponent } from '../../ag-grid/cell-renderer/action-cells/create-case-action-cell/create-case-action-cell.component';
import { CreateCaseActionHeaderComponent } from '../../ag-grid/cell-renderer/action-cells/create-case-action-header/create-case-action-header.component';
import { ProcessCaseActionCellComponent } from '../../ag-grid/cell-renderer/action-cells/process-case-action-cell/process-case-action-cell.component';
import { ProcessCaseActionHeaderComponent } from '../../ag-grid/cell-renderer/action-cells/process-case-action-header/process-case-action-header.component';
import { AddMaterialButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/add-material-button/add-material-button.component';
import { CreateCaseButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/create-case-button/create-case-button.component';
import { CreateCaseResetAllButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/create-case-reset-all-button/create-case-reset-all-button.component';
import { ProcessCaseResetAllButtonComponent } from '../../ag-grid/custom-status-bar/case-material-table/process-case-reset-all-button/process-case-reset-all-button.component';
import { LOCALE_DE } from '../../constants';
import { Keyboard } from '../../models';
import { StatusBarConfig } from '../../models/table';
import { PLsSeriesResponse } from '../rest-services/search-service/models/pls-series-response.model';

@Injectable({
  providedIn: 'root',
})
export class HelperService {
  constructor(
    private readonly translocoCurrencyPipe: TranslocoCurrencyPipe,
    private readonly translocoDatePipe: TranslocoDatePipe,
    private readonly translocoPercentPipe: TranslocoPercentPipe,
    private readonly translocoDecimalPipe: TranslocoDecimalPipe
  ) {}

  static getCurrentYear(): number {
    return new Date().getFullYear();
  }

  static getLastYear(): number {
    return HelperService.getCurrentYear() - 1;
  }

  static initStatusBar(
    isCaseView: boolean,
    statusBar: StatusBarConfig
  ): StatusBarConfig {
    const addPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? CreateCaseButtonComponent
        : AddMaterialButtonComponent,
      align: 'left',
    };

    const resetPanel: StatusPanelDef = {
      statusPanel: isCaseView
        ? CreateCaseResetAllButtonComponent
        : ProcessCaseResetAllButtonComponent,
      align: 'right',
    };

    return { statusPanels: [...statusBar.statusPanels, addPanel, resetPanel] };
  }

  static initColDef(isCaseView: boolean, colDef: ColDef[]): ColDef[] {
    const actionCell: ColDef = {
      cellRenderer: isCaseView
        ? CreateCaseActionCellComponent
        : ProcessCaseActionCellComponent,
      flex: 0.2,
      headerComponent: isCaseView
        ? CreateCaseActionHeaderComponent
        : ProcessCaseActionHeaderComponent,
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
    const gpsdGroupIds = [
      ...new Set(response.map((item) => item.gpsdGroupId)),
    ].map((el) => ({ value: el, selected: true }));
    const plsAndSeries: PLsAndSeries = {
      series,
      pls: [],
      gpsdGroupIds,
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

  transformNumber(number: number, showDigits: boolean): string {
    if (number === undefined) {
      return Keyboard.DASH;
    }

    return this.translocoDecimalPipe.transform(number, {
      minimumFractionDigits: showDigits ? 2 : undefined,
      maximumFractionDigits: showDigits ? 2 : 0,
    });
  }

  transformNumberExcel(number: number): string {
    if (!number) {
      return Keyboard.DASH;
    }

    return this.translocoDecimalPipe.transform(
      number,
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: false,
      },
      'en-US'
    );
  }

  transformNumberCurrency(number: string, currency: string): string {
    return number
      ? this.translocoCurrencyPipe.transform(
          number,
          'code',
          undefined,
          currency
        )
      : Keyboard.DASH;
  }

  transformMarginDetails(value: number, currency: string): string {
    if (!value) {
      return Keyboard.DASH;
    }

    return this.transformNumberCurrency(value.toString(), currency);
  }

  transformPercentage(percentage: number): string {
    return percentage
      ? this.translocoPercentPipe.transform(percentage / 100, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
      : Keyboard.DASH;
  }

  transformDate(date: string, includeTime: boolean = false): string {
    if (!date) {
      return '';
    }

    return this.translocoDatePipe.transform(date, {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: includeTime ? '2-digit' : undefined,
      minute: includeTime ? '2-digit' : undefined,
    });
  }
}

const isPaste = (event: KeyboardEvent): boolean =>
  (event.ctrlKey && event.key === 'v') || (event.metaKey && event.key === 'v'); // support for macOs
