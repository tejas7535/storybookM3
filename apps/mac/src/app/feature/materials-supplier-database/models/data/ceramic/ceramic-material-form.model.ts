import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialForm } from '@mac/msd/models';

export interface CeramicMaterialForm extends BaseMaterialForm {
  condition: FormControl<StringOption>;
}
