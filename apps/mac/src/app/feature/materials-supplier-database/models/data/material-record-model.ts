import { ManufacturerSupplier, Material, MaterialStandard } from './index';

export interface CreateMaterialRecord {
  standard: MaterialStandard;
  supplier: ManufacturerSupplier;
  material: Material;

  state: CreateMaterialState;
  error: boolean;
}

export enum CreateMaterialState {
  Initial,
  MaterialStandardCreated,
  ManufacturerSupplierCreated,
  MaterialCreated,
  MaterialStandardSkipped,
  ManufacturerSupplierSkipped,
  MaterialStandardCreationFailed,
  ManufacturerSupplierCreationFailed,
  MaterialCreationFailed,
  Suspended,
}
