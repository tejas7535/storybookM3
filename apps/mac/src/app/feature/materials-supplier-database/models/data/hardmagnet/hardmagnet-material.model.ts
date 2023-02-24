import { BaseMaterial } from '@mac/msd/models';

export interface HardmagnetMaterial extends BaseMaterial {
  coating?: string;
  productionProcess: string;
  grade?: string;
}
