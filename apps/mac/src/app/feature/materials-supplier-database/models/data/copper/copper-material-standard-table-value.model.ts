import { BaseMaterialStandardTableValue } from '@mac/msd/models';

export interface CopperMaterialStandardTableValue
  extends BaseMaterialStandardTableValue {
  materialStandardStandardDocument: string;
  materialNumbers?: string[];
}
