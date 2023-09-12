import { BaseMaterial } from '@mac/msd/models';

export interface LubricantMaterial extends BaseMaterial {
  materialNumbers?: string[];
  materialStandardStoffId?: string;
  materialStandardWiamId?: string;
  materialSapId?: string;
  co2type?: string;
  grade?: string;
}
