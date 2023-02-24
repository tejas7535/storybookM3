import { BaseMaterialResponse } from '@mac/msd/models';

export interface HardmagnetMaterialResponse extends BaseMaterialResponse {
  coating: string;
  productionProcess: string;
  grade: string;
}
