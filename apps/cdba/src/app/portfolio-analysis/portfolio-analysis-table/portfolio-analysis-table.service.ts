import { Injectable } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { ColDef } from 'ag-grid-enterprise';

import { CurrencyService } from '@cdba/shared/services/currency/currency.service';

import { DataField } from './portfolio-analysis-table.models';

@Injectable()
export class PortfolioAnalysisTableService {
  dataFields: DataField[];
  labelColumn: ColDef;

  constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly translocoService: TranslocoService,
    private readonly currencyService: CurrencyService
  ) {
    this.labelColumn = {
      field: 'label',
      headerName: '',
      suppressMenu: true,
      width: 120,
      minWidth: 120,
      maxWidth: 120,
      cellStyle: { borderRightColor: 'inherit' },
      cellClass: ['!px-2'],
    };

    this.dataFields = [
      {
        fieldName: 'sqvMargin',
        label: this.translocoService.translate(
          'portfolioAnalysis.label.sqvMargin'
        ),
      },
      {
        fieldName: 'sqvCosts',
        label: this.translocoService.translate('portfolioAnalysis.label.sqv'),
      },
      {
        fieldName: 'gpcMargin',
        label: this.translocoService.translate(
          'portfolioAnalysis.label.gpcMargin'
        ),
      },
      {
        fieldName: 'gpcCosts',
        label: this.translocoService.translate('portfolioAnalysis.label.gpc'),
      },
      {
        fieldName: 'averagePrice',
        label: this.translocoService.translate(
          'portfolioAnalysis.label.averagePrice'
        ),
      },
    ];
  }

  public readonly getLabelColumn = () => this.labelColumn;

  public readonly getDataFields = () => [...this.dataFields];

  public readonly formatValue = (value: number, fieldName: string): string => {
    switch (fieldName) {
      case 'sqvMargin':
      case 'gpcMargin':
        return this.formatMarginValue(value);
      default:
        return this.formatPriceValue(value);
    }
  };

  private readonly formatMarginValue = (value: number): string =>
    value
      ? `${this.localeService.localizeNumber(
          value * 100,
          'decimal',
          undefined,
          {
            maximumFractionDigits: 2,
          }
        )} %`
      : '';

  private readonly formatPriceValue = (value: number): string =>
    value
      ? `${this.localeService.localizeNumber(
          value,
          'decimal'
        )} ${this.currencyService.getCurrency()}`
      : '';
}
