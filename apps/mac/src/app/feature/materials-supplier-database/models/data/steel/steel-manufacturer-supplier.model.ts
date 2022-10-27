import { BaseManufacturerSupplier } from '@mac/msd/models';

export interface SteelManufacturerSupplier extends BaseManufacturerSupplier {
  manufacturer: boolean;
  sapData?: {
    sapSupplierId: string;
  }[];
}
