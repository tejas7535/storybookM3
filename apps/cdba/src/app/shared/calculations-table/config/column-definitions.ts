import { ColDef } from '@ag-grid-community/core';
import { translate } from '@ngneat/transloco';

import { formatDate, valueGetterDate } from '../../table';

export const COLUMN_DEFINITIONS: { [key: string]: ColDef } = {
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
    headerName: translate('detail.calculationTable.headers.costingDateFrom'),
    headerTooltip: translate(
      'detail.calculationTable.tooltips.costingDateFrom'
    ),
    valueGetter: (params) => valueGetterDate(params, 'costingDateFrom'),
    valueFormatter: formatDate,
  },
  costingVariant: {
    field: 'costingVariant',
    headerName: translate('detail.calculationTable.headers.costingVariant'),
    headerTooltip: translate('detail.calculationTable.tooltips.costingVariant'),
  },
  priceEur: {
    field: 'priceEur',
    headerName: translate('detail.calculationTable.headers.priceEur'),
    headerTooltip: translate('detail.calculationTable.tooltips.priceEur'),
  },
  priceEurCurrency: {
    field: 'priceEurCurrency',
    headerName: translate('detail.calculationTable.headers.priceEurCurrency'),
    headerTooltip: translate(
      'detail.calculationTable.tooltips.priceEurCurrency'
    ),
  },
  priceUnit: {
    field: 'priceUnit',
    headerName: translate('detail.calculationTable.headers.priceUnit'),
    headerTooltip: translate(
      'detail.calculationTable.tooltips.priceEurCurrency'
    ),
  },
  plant: {
    field: 'plant',
    headerName: translate('detail.calculationTable.headers.plant'),
    headerTooltip: translate('detail.calculationTable.tooltips.plant'),
  },
  quantity: {
    field: 'quantity',
    headerName: translate('detail.calculationTable.headers.quantity'),
    headerTooltip: translate('detail.calculationTable.tooltips.quantity'),
  },
  lotSize: {
    field: 'lotSize',
    headerName: translate('detail.calculationTable.headers.lotSize'),
    headerTooltip: translate('detail.calculationTable.tooltips.lotSize'),
  },
};
