import { ColDef, IRowNode } from 'ag-grid-community';

export type ColumnForUploadTable<T> = {
  // t functions in constants are not working properly, so use a function here that the TableUpload component can call
  headerNameFn: () => string;
  field: keyof T;
  editable: true;
  validationFn?: (
    value: string,
    rowData: IRowNode
  ) => string | null | undefined;
} & Partial<ColDef<T>>;
