import { ClientSideRowModelModule } from '@ag-grid-community/all-modules';
import {
  ColumnsToolPanelModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  MenuModule,
  RowGroupingModule,
  SetFilterModule,
  StatusBarModule,
} from '@ag-grid-enterprise/all-modules';

export const MODULES: any[] = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RowGroupingModule,
  StatusBarModule,
  ExcelExportModule,
  SetFilterModule,
];
