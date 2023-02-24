import { BaseMaterialRequest } from '@mac/msd/models';

export interface HardmagnetMaterialRequest extends BaseMaterialRequest {
  coating: string;
  productionProcess: string;
  grade: string;
}
