import { FormControl } from '@angular/forms';

import { StringOption } from '@schaeffler/inputs';

export interface BaseMaterialForm {
  productCategory: FormControl<StringOption>;
  manufacturerSupplierId: FormControl<number>;
  materialStandardId: FormControl<number>;
  co2Scope1: FormControl<number>;
  co2Scope2: FormControl<number>;
  co2Scope3: FormControl<number>;
  co2PerTon: FormControl<number>;
  co2Classification: FormControl<StringOption>;
  releaseRestrictions: FormControl<string>;

  standardDocument: FormControl<StringOption>;
  materialName: FormControl<StringOption>;
  supplier: FormControl<StringOption>;
  supplierPlant: FormControl<StringOption>;
  supplierCountry: FormControl<StringOption>;
}
