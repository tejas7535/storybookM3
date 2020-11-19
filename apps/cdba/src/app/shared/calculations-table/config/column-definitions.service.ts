import { Injectable } from '@angular/core';

import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { formatDate, formatNumber, valueGetterDate } from '../../table';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
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
    },
    costingDateFrom: {
      headerName: translate('detail.shared.calculationTable.costingDateFrom'),
      headerTooltip: translate(
        'detail.shared.calculationTable.costingDateFrom'
      ),
      valueGetter: (params) => valueGetterDate(params, 'costingDateFrom'),
      valueFormatter: formatDate,
      filter: 'agDateColumnFilter',
    },
    costingVariant: {
      field: 'costingVariant',
      headerName: translate('detail.shared.calculationTable.costingVariant'),
      headerTooltip: translate('detail.shared.calculationTable.costingVariant'),
    },
    priceEur: {
      field: 'priceEur',
      headerName: translate('detail.shared.calculationTable.priceEur'),
      headerTooltip: translate('detail.shared.calculationTable.priceEur'),
      filter: 'agNumberColumnFilter',
    },
    priceEurCurrency: {
      field: 'priceEurCurrency',
      headerName: translate('detail.shared.calculationTable.priceEurCurrency'),
      headerTooltip: translate(
        'detail.shared.calculationTable.priceEurCurrency'
      ),
    },
    priceUnit: {
      field: 'priceUnit',
      headerName: translate('detail.shared.calculationTable.priceUnit'),
      headerTooltip: translate(
        'detail.shared.calculationTable.priceEurCurrency'
      ),
    },
    plant: {
      field: 'plant',
      headerName: translate('detail.shared.calculationTable.plant'),
      headerTooltip: translate('detail.shared.calculationTable.plant'),
    },
    quantity: {
      field: 'quantity',
      headerName: translate('detail.shared.calculationTable.quantity'),
      headerTooltip: translate('detail.shared.calculationTable.quantity'),
      valueFormatter: formatNumber,
      filter: 'agNumberColumnFilter',
    },
    lotSize: {
      field: 'lotSize',
      headerName: translate('detail.shared.calculationTable.lotSize'),
      headerTooltip: translate('detail.shared.calculationTable.lotSize'),
      valueFormatter: formatNumber,
      filter: 'agNumberColumnFilter',
    },
  };
}
