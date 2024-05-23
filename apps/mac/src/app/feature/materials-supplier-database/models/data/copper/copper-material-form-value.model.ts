import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialFormValue } from '@mac/msd/models';

export interface CopperMaterialFormValue extends BaseMaterialFormValue {
  referenceDoc: StringOption[];
  castingMode: string;
  castingDiameter: StringOption;
  maxDimension: number;
  productionProcess: StringOption;
  materialNumber: string;
  minRecyclingRate: number;
  maxRecyclingRate: number;
}
