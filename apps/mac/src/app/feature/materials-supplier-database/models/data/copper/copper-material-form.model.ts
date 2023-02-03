import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialForm } from '@mac/msd/models';

export interface CopperMaterialForm extends BaseMaterialForm {
  referenceDoc: FormControl<StringOption[]>;
  castingMode: FormControl<string>;
  castingDiameter: FormControl<StringOption>;
  maxDimension: FormControl<number>;
  productionProcess: FormControl<StringOption>;
  materialNumber: FormControl<string>;
}
