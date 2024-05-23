import { BaseMaterial } from '@mac/msd/models';

export interface AluminumMaterial extends BaseMaterial {
  minRecyclingRate?: number;
  maxRecyclingRate?: number;
}
