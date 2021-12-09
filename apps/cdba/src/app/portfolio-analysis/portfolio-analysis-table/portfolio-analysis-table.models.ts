export interface TransposedRowData {
  label: string;
  [index: string]: string | number;
}

export interface DataField {
  fieldName: string;
  label: string;
}
