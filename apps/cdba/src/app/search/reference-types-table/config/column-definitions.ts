import { ColDef } from '@ag-grid-enterprise/all-modules';
import { translate } from '@ngneat/transloco';

export const COLUMN_DEFINITIONS: { [key: string]: ColDef } = {
  materialNumber: {
    field: 'materialNumber',
    headerName: translate('search.referenceTypesTable.headers.materialNumber'),
    headerTooltip: translate(
      'search.referenceTypesTable.tooltips.materialNumber'
    ),
    checkboxSelection: true,
  },
  plant: {
    field: 'plant',
    headerName: translate('search.referenceTypesTable.headers.plant'),
    headerTooltip: translate('search.referenceTypesTable.tooltips.plant'),
  },
  materialDesignation: {
    field: 'materialDesignation',
    headerName: 'Material Designation',
  },
  msd: {
    field: 'msd',
    headerName: 'Material Short Description',
  },
  productLine: {
    field: 'productLine',
    headerName: 'Product Line',
  },
  pcmQuantity: {
    field: 'pcmQuantity',
    headerName: 'PCM Quantity',
    filter: 'agNumberColumnFilter',
  },
  width: {
    field: 'width',
    headerName: 'Width',
    filter: 'agNumberColumnFilter',
  },
};
