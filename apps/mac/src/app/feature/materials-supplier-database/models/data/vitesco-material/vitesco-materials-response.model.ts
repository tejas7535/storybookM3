import { VitescoMaterial } from './vitesco-material.model';

export interface VitescoMaterialsResponse {
  data: VitescoMaterial[];
  lastRow: number;
  totalRows: number;
  subTotalRows: number;
}
