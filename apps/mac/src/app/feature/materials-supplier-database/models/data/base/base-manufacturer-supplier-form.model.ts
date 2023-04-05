import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

export interface BaseManufacturerSupplierForm {
  id?: FormControl<number>;
  name: FormControl<StringOption>;
  plant: FormControl<StringOption>;
  country: FormControl<StringOption>;
  sapSupplierIds?: FormControl<StringOption[]>;
}
