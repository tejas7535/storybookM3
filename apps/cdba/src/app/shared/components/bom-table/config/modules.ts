import { Module } from '@ag-grid-community/core';
import {
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  ExcelExportModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SideBarModule,
  StatusBarModule,
} from '@ag-grid-enterprise/all-modules';

export const BOM_TABLE_MODULES: Module[] = [
  ClientSideRowModelModule,
  RowGroupingModule,
  ExcelExportModule,
  StatusBarModule,
  RangeSelectionModule,
  SideBarModule,
  ColumnsToolPanelModule,
  MenuModule,
];
