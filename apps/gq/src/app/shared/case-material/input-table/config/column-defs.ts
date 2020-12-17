import { ColDef } from '@ag-grid-community/all-modules';
import { translate } from '@ngneat/transloco';

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
export const COLUMN_DEFS: ColDef[] = [
  {
    headerName: translate('shared.caseMaterial.table.materialNumber'),
    field: 'materialNumber',
    flex: 0.4,
    sortable: true,
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
