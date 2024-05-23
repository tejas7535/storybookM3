import { BaseMaterialRequest } from '@mac/msd/models';

export interface CopperMaterialRequest extends BaseMaterialRequest {
  referenceDoc?: string;
  castingMode: string;
  castingDiameter: string;
  maxDimension: number;
  productionProcess?: string;
  minRecyclingRate?: number;
  maxRecyclingRate?: number;
}
