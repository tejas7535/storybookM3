import { ColDef } from 'ag-grid-community';

export const excludeColumn = (columns: string[], colDef: ColDef[]): ColDef[] =>
  colDef.filter((cd) => !columns.includes(cd.field));
