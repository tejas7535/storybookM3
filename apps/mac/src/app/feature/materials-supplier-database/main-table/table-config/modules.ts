import {
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  FiltersToolPanelModule,
  MenuModule,
  MultiFilterModule,
  SetFilterModule,
  SideBarModule,
} from '@ag-grid-enterprise/all-modules';

export const MODULES = [
  ClientSideRowModelModule,
  SideBarModule,
  ColumnsToolPanelModule,
  MultiFilterModule,
  FiltersToolPanelModule,
  SetFilterModule,
  MenuModule,
  ExcelExportModule,
];
