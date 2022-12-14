import { FormControl } from '@angular/forms';

import { BaseMaterialStandardForm } from '../base';

export interface SteelMaterialStandardForm extends BaseMaterialStandardForm {
  materialNumber: FormControl<string>;
}
