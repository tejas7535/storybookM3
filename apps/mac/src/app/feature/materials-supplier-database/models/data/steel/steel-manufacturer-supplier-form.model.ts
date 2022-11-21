import { FormControl } from '@angular/forms';

import { BaseManufacturerSupplierForm } from '../base';

export interface SteelManufacturerSupplierForm
  extends BaseManufacturerSupplierForm {
  manufacturer: FormControl<boolean>;
}
