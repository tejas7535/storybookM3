import { ClientSideRowModelModule } from '@ag-grid-community/client-side-row-model';
import {
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
  Module,
} from '@ag-grid-enterprise/all-modules';

export const SAP_PRICE_DETAILS_MODULE: Module[] = [
  ClientSideRowModelModule,
  ColumnsToolPanelModule,
  FiltersToolPanelModule,
  MenuModule,
];
