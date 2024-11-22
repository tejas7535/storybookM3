import { ColDef, IRowNode } from 'ag-grid-community';

export type ColumnForUploadTable<T> = {
  field: keyof T;
  editable: true;
  validationFn?: (
    value: string,
    rowData: IRowNode
  ) => string | null | undefined;
} & Partial<ColDef<T>>;
