import { ColDef, GridApi, IRowNode } from 'ag-grid-enterprise';

export type ColumnForUploadTable<T> = {
  field: keyof T;
  editable: true;
  validationFn?: (
    value: string,
    rowData: IRowNode,
    gridApi?: GridApi
  ) => string | null | undefined;
  bgColorFn?: () => string | null | undefined;
} & Partial<ColDef<T>>;
