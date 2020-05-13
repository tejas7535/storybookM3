import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'materialNumber',
    headerName: translate('search.referenceTypesTable.headers.materialNumber'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.materialNumber'
    ),
    pinned: 'left',
    checkboxSelection: true,
  },
  {
    field: 'plant',
    headerName: translate('search.referenceTypesTable.headers.plant'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.plant'),
  },
  {
    field: 'materialDesignation',
    headerName: 'Material Designation',
  },
  {
    field: 'materialShortDescription',
    headerName: 'Material Short Description',
  },
  {
    field: 'productLine',
    headerName: 'Product Line',
  },
  {
    field: 'pcmQuantity',
    headerName: 'PCM Quantity',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'width',
    headerName: 'Width',
    filter: 'agNumberColumnFilter',
  },
];
