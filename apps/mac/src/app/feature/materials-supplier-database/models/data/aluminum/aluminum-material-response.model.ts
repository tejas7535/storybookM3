import { BaseMaterialResponse } from '@mac/msd/models';

export interface AluminumMaterialResponse extends BaseMaterialResponse {
  minRecyclingRate?: number;
  maxRecyclingRate?: number;
}
