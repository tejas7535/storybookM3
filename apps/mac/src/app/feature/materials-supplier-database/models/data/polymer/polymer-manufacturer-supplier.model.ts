import { BaseManufacturerSupplier } from '@mac/msd/models';

export interface PolymerManufacturerSupplier extends BaseManufacturerSupplier {
  sapData?: {
    sapSupplierId: string;
  }[];
}
