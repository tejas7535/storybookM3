import { BaseMaterialFormValue } from '@mac/msd/models';

export interface AluminumMaterialFormValue extends BaseMaterialFormValue {
  minRecyclingRate: number;
  maxRecyclingRate: number;
}
