import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  Module,
  RowGroupingModule,
  SetFilterModule,
  StatusBarModule,
} from '@ag-grid-enterprise/all-modules';

export const MODULES: Module[] = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  RowGroupingModule,
  StatusBarModule,
  SetFilterModule,
];
