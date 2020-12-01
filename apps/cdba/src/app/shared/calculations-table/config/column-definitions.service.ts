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
    calculationDate: {
      headerName: translate('detail.shared.calculationTable.calculationDate'),
      headerTooltip: translate(
        'detail.shared.calculationTable.calculationDate'
      ),
      valueGetter: (params) => valueGetterDate(params, 'calculationDate'),
      valueFormatter: formatDate,
      filter: 'agDateColumnFilter',
    },
    costType: {
      field: 'costType',
      headerName: translate('detail.shared.calculationTable.costType'),
      headerTooltip: translate('detail.shared.calculationTable.costType'),
    },
    price: {
      field: 'price',
      headerName: translate('detail.shared.calculationTable.price'),
      headerTooltip: translate('detail.shared.calculationTable.price'),
      filter: 'agNumberColumnFilter',
    },
    currency: {
      field: 'currency',
      headerName: translate('detail.shared.calculationTable.currency'),
      headerTooltip: translate('detail.shared.calculationTable.currency'),
    },
    priceUnit: {
      field: 'priceUnit',
      headerName: translate('detail.shared.calculationTable.priceUnit'),
      headerTooltip: translate('detail.shared.calculationTable.priceUnit'),
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
    bomCostingVersion: {
      field: 'bomCostingVersion',
      headerName: translate('detail.shared.calculationTable.costingVersion'),
      headerTooltip: translate('detail.shared.calculationTable.costingVersion'),
    },
    rfqNumber: {
      field: 'rfqNumber',
      headerName: translate('detail.shared.calculationTable.rfqNumber'),
      headerTooltip: translate('detail.shared.calculationTable.rfqNumber'),
    },
  };
}
