import { BaseMaterial } from '@mac/msd/models';

export interface CopperMaterial extends BaseMaterial {
  materialNumbers?: string[];
  referenceDoc?: string;
  castingMode: string;
  castingDiameter: string;
  maxDimension: number;
  productionProcess?: string;
  productionProcessText?: string;
}
