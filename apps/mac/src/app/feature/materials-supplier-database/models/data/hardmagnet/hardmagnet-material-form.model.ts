import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialForm } from '@mac/msd/models';

export interface HardmagnetMaterialForm extends BaseMaterialForm {
  coating: FormControl<StringOption>;
  productionProcess: FormControl<StringOption>;
  grade: FormControl<string>;
}
