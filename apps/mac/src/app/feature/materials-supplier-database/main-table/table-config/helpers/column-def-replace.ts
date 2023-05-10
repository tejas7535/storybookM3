import { ColDef } from 'ag-grid-community';

export const replaceColumn = (columns: ColDef[], colDef: ColDef[]): ColDef[] =>
  colDef.map((cd) => columns.find((col) => col.field === cd.field) || cd);
