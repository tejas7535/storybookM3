import { BaseMaterialStandardTableValue } from '@mac/msd/models';

export interface SteelMaterialStandardTableValue
  extends BaseMaterialStandardTableValue {
  materialStandardStandardDocument: string;
  materialNumbers?: string[];
}
