import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialFormValue } from '@mac/msd/models';

export interface HardmagnetMaterialFormValue extends BaseMaterialFormValue {
  productionProcess: StringOption;
  coating: StringOption;
  grade: string;
}
