import { FormControl } from '@angular/forms';

import { BaseMaterialStandardForm } from '../base';

export interface CopperMaterialStandardForm extends BaseMaterialStandardForm {
  materialNumber: FormControl<string>;
}
