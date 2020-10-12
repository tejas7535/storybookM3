import { ClientSideRowModelModule } from '@ag-grid-community/all-modules';
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RowGroupingModule,
  SideBarModule,
  StatusBarModule,
} from '@ag-grid-enterprise/all-modules';

export const MODULES: any[] = [
  ClientSideRowModelModule,
  RowGroupingModule,
  FiltersToolPanelModule,
  ColumnsToolPanelModule,
  MenuModule,
  SideBarModule,
  StatusBarModule,
];
