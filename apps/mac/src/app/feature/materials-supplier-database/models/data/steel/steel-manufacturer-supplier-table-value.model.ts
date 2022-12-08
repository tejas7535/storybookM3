import { BaseManufacturerSupplierTableValue } from '@mac/msd/models';

export interface SteelManufacturerSupplierTableValue
  extends BaseManufacturerSupplierTableValue {
  sapSupplierIds?: string[];
}
