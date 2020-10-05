import { ClientSideRowModelModule } from '@ag-grid-community/all-modules';
import {
  ClipboardModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  SetFilterModule,
  SideBarModule,
  StatusBarModule,
} from '@ag-grid-enterprise/all-modules';

export const MODULES = [
  ClientSideRowModelModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  MenuModule,
  RangeSelectionModule,
  RowGroupingModule,
  StatusBarModule,
  ClipboardModule,
  SetFilterModule,
  SideBarModule,
];

export const MODULES_MINIFIED = [ClientSideRowModelModule];
