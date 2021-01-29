import { ColDef, ValueFormatterParams } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

import { MaterialTransformPipe } from '../../../pipes/material-transform.pipe';

export const materialPipe = new MaterialTransformPipe();

export const infoComparator = (info1: any, info2: any): number => {
  const valid1 = info1.valid;
  const valid2 = info2.valid;

  if (valid1 === valid2) {
    return 0;
  }
  if (valid1 && !valid2) {
    return 1;
  }
  if (valid2 && !valid1) {
    return -1;
  }

  return 0;
};

export const transformMaterial = (data: ValueFormatterParams): string => {
  return materialPipe.transform(data.value);
};

export const COLUMN_DEFS: ColDef[] = [
  {
    headerName: translate('shared.caseMaterial.table.materialNumber'),
    field: 'materialNumber',
    flex: 0.4,
    sortable: true,
    valueFormatter: transformMaterial,
  },
  {
    headerName: translate('shared.caseMaterial.table.quantity'),
    field: 'quantity',
    flex: 0.4,
    sortable: true,
  },
  {
    headerName: translate('shared.caseMaterial.table.info.title'),
    field: 'info',
    cellRenderer: 'infoCellComponent',
    flex: 0.1,
    sortable: true,
    comparator: infoComparator,
  },
  {
    cellRenderer: 'actionCellComponent',
    cellRendererParams: 'createCase',
    flex: 0.1,
  },
];
