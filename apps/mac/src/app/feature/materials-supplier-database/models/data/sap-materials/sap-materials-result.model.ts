import { LoadSuccessParams } from 'ag-grid-community';

import { SAPMaterial } from './sap-material.model';

export interface SAPMaterialsResult extends LoadSuccessParams {
  rowData: SAPMaterial[];
  rowCount: number;
}
