import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  Module,
  SetFilterModule,
} from '@ag-grid-enterprise/all-modules';

export const MODULES: Module[] = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  SetFilterModule,
];
