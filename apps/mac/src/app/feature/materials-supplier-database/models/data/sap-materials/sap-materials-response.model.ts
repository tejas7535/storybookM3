import { SAPMaterial } from './sap-material.model';

export interface SAPMaterialsResponse {
  data: SAPMaterial[];
  lastRow: number;
  totalRows: number;
  subTotalRows: number;
}
