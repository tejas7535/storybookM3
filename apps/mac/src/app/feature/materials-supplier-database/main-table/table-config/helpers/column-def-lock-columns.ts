import { ColDef } from 'ag-grid-community';

export const lockColumns = (columns: string[], colDef: ColDef[]): ColDef[] =>
  colDef.map((cd) =>
    columns.includes(cd.field)
      ? ({
          ...cd,
          lockVisible: true,
          hide: false,
        } as ColDef)
      : cd
  );
