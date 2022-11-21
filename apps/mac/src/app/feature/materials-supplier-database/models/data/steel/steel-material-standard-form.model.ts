import { FormControl } from '@angular/forms';

import { BaseManufacturerSupplierForm } from '../base';

export interface SteelMaterialStandardForm
  extends BaseManufacturerSupplierForm {
  materialNumber: FormControl<string>;
}
