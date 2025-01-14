import { LoadSuccessParams } from 'ag-grid-community';

import { VitescoMaterial } from './vitesco-material.model';

export interface VitescoMaterialsResult extends LoadSuccessParams {
  rowData: VitescoMaterial[];
  rowCount: number;
}
