import { BaseMaterialStandard } from '@mac/msd/models';

export interface SteelMaterialStandard extends BaseMaterialStandard {
  standardDocument: string;
  materialNumber?: string[];
  wiamId?: string;
  stoffId?: string;
}
