import { BaseMaterialStandard } from '@mac/msd/models';

export interface LubricantMaterialStandard extends BaseMaterialStandard {
  stoffId?: string;
  wiamId?: string;
  materialNumber?: string[];
}
