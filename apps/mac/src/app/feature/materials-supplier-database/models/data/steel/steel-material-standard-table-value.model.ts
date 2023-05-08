import { BaseMaterialStandardTableValue } from '@mac/msd/models';

export interface SteelMaterialStandardTableValue
  extends BaseMaterialStandardTableValue {
  materialNumbers?: string[];
  materialStandardWiamId?: string;
  materialStandardStoffId?: string;
}
