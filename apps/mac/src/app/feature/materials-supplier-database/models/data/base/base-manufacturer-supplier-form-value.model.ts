import { StringOption } from '@schaeffler/inputs';

export interface BaseManufacturerSupplierFormValue {
  id?: number;
  name: StringOption;
  plant: StringOption;
  country: StringOption;
}
