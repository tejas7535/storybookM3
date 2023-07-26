import {
  BaseMaterialResponse,
  LubricantMaterialStandard,
} from '@mac/msd/models';

export interface LubricantMaterialResponse extends BaseMaterialResponse {
  materialStandard: LubricantMaterialStandard;
  co2Type?: string;
  materialSapId?: string;
}
