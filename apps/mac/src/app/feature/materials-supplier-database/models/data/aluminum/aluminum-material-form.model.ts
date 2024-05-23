import { FormControl } from '@angular/forms';

import { BaseMaterialForm } from '@mac/msd/models';

export interface AluminumMaterialForm extends BaseMaterialForm {
  minRecyclingRate: FormControl<number>;
  maxRecyclingRate: FormControl<number>;
}
