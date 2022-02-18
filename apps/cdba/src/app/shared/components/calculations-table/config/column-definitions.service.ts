import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-enterprise/all-modules';
import { Calculation } from '@cdba/shared/models';
import { translate } from '@ngneat/transloco';

import { ColumnUtilsService, valueGetterDate } from '../../table';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  constructor(private readonly columnUtilsService: ColumnUtilsService) {}

  COLUMN_DEFINITIONS: { [key: string]: ColDef } = {
    checkbox: {
      suppressMovable: true,
      checkboxSelection: true,
      sortable: false,
      filter: false,
      resizable: false,
      enablePivot: false,
      enableRowGroup: false,
      filterParams: false,
      suppressMenu: true,
      suppressColumnsToolPanel: true,
      minWidth: 70,
      width: 70,
      pinned: 'left',
      colId: 'checkbox',
    },
    calculationDate: {
      field: 'calculationDate',
      headerName: translate('shared.calculations.table.calculationDate'),
      headerTooltip: translate('shared.calculations.table.calculationDate'),
      valueGetter: (params) =>
        valueGetterDate<Calculation>(params, 'calculationDate'),
      valueFormatter: this.columnUtilsService.formatDate,
      filter: 'agDateColumnFilter',
    },
    costType: {
      field: 'costType',
      headerName: translate('shared.calculations.table.costType'),
      headerTooltip: translate('shared.calculations.table.costType'),
    },
    price: {
      field: 'price',
      headerName: translate('shared.calculations.table.price'),
      headerTooltip: translate('shared.calculations.table.price'),
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 3,
        }),
    },
    currency: {
      field: 'currency',
      headerName: translate('shared.calculations.table.currency'),
      headerTooltip: translate('shared.calculations.table.currency'),
    },
    priceUnit: {
      field: 'priceUnit',
      headerName: translate('shared.calculations.table.priceUnit'),
      headerTooltip: translate('shared.calculations.table.priceUnit'),
    },
    plant: {
      field: 'plant',
      headerName: translate('shared.calculations.table.plant'),
      headerTooltip: translate('shared.calculations.table.plant'),
    },
    quantity: {
      field: 'quantity',
      headerName: translate('shared.calculations.table.quantity'),
      headerTooltip: translate('shared.calculations.table.quantity'),
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    lotSize: {
      field: 'lotSize',
      headerName: translate('shared.calculations.table.lotSize'),
      headerTooltip: translate('shared.calculations.table.lotSize'),
      filter: 'agNumberColumnFilter',
      type: 'numericColumn',
      valueFormatter: this.columnUtilsService.formatNumber,
    },
    bomCostingVersion: {
      field: 'bomCostingVersion',
      headerName: translate('shared.calculations.table.costingVersion'),
      headerTooltip: translate('shared.calculations.table.costingVersion'),
    },
    rfqNumber: {
      field: 'rfqNumber',
      headerName: translate('shared.calculations.table.rfqNumber'),
      headerTooltip: translate('shared.calculations.table.rfqNumber'),
    },
  };
}
