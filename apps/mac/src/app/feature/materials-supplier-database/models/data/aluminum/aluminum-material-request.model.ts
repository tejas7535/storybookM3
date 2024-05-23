import { BaseMaterialRequest } from '@mac/msd/models';

export interface AluminumMaterialRequest extends BaseMaterialRequest {
  minRecyclingRate?: number;
  maxRecyclingRate?: number;
}
