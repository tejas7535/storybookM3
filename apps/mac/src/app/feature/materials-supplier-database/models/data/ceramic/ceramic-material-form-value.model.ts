import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialFormValue } from '@mac/msd/models';

export interface CeramicMaterialFormValue extends BaseMaterialFormValue {
  condition: StringOption;
}
