import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

import { BaseMaterialForm } from '@mac/msd/models';

export interface SteelMaterialForm extends BaseMaterialForm {
  referenceDoc: FormControl<StringOption[]>;
  releaseDateYear: FormControl<number>;
  releaseDateMonth: FormControl<number>;
  blocked: FormControl<boolean>;
  castingMode: FormControl<string>;
  castingDiameter: FormControl<StringOption>;
  maxDimension: FormControl<number>;
  minDimension: FormControl<number>;
  steelMakingProcess: FormControl<StringOption>;
  rating: FormControl<StringOption>;
  ratingRemark: FormControl<string>;
  ratingChangeComment: FormControl<string>;
  materialNumber: FormControl<string>;
  manufacturer: FormControl<boolean>;
  minRecyclingRate: FormControl<number>;
  maxRecyclingRate: FormControl<number>;

  selfCertified: FormControl<boolean>;
}
