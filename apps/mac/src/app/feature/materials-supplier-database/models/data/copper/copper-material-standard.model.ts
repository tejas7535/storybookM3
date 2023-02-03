import { BaseMaterialStandard } from '@mac/msd/models';

export interface CopperMaterialStandard extends BaseMaterialStandard {
  standardDocument: string;
  materialNumber?: string[];
}
