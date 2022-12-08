import { BaseManufacturerSupplierTableValue } from '@mac/msd/models';

export interface PolymerManufacturerSupplierTableValue
  extends BaseManufacturerSupplierTableValue {
  sapSupplierIds?: string[];
}
