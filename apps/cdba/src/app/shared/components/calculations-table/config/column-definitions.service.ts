import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { Calculation } from '@cdba/shared/models';

import { ColumnUtilsService, valueGetterDate } from '../../table';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  constructor(private readonly columnUtilsService: ColumnUtilsService) {}

  public getColDef(): ColDef[] {
    return [
      {
        field: 'calculationDate',
        headerName: translate('shared.calculations.table.calculationDate'),
        headerTooltip: translate('shared.calculations.table.calculationDate'),
        width: 170,
        valueGetter: (params) =>
          valueGetterDate<Calculation>(params, 'calculationDate'),
        valueFormatter: this.columnUtilsService.formatDate,
        filter: 'agDateColumnFilter',
      },
      {
        field: 'costType',
        headerName: translate('shared.calculations.table.costType'),
        headerTooltip: translate('shared.calculations.table.costType'),
        width: 120,
      },
      {
        field: 'price',
        headerName: translate('shared.calculations.table.price'),
        headerTooltip: translate('shared.calculations.table.price'),
        width: 110,
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(params, {
            minimumFractionDigits: 3,
          }),
      },
      {
        field: 'currency',
        headerName: translate('shared.calculations.table.currency'),
        headerTooltip: translate('shared.calculations.table.currency'),
        width: 130,
      },
      {
        field: 'priceUnit',
        headerName: translate('shared.calculations.table.priceUnit'),
        headerTooltip: translate('shared.calculations.table.priceUnit'),
        width: 120,
      },
      {
        field: 'plant',
        headerName: translate('shared.calculations.table.plant'),
        headerTooltip: translate('shared.calculations.table.plant'),
        width: 110,
      },
      {
        field: 'quantity',
        headerName: translate('shared.calculations.table.quantity'),
        headerTooltip: translate('shared.calculations.table.quantity'),
        width: 120,
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: this.columnUtilsService.formatNumber,
      },
      {
        field: 'lotSize',
        headerName: translate('shared.calculations.table.lotSize'),
        headerTooltip: translate('shared.calculations.table.lotSize'),
        width: 120,
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: this.columnUtilsService.formatNumber,
      },
      {
        field: 'bomCostingVersion',
        headerName: translate('shared.calculations.table.costingVersion'),
        headerTooltip: translate('shared.calculations.table.costingVersion'),
        width: 160,
      },
      {
        field: 'rfqNumber',
        headerName: translate('shared.calculations.table.rfqNumber'),
        headerTooltip: translate('shared.calculations.table.rfqNumber'),
        width: 150,
      },
    ];
  }
}
