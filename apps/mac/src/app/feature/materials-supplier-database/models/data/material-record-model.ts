import { MaterialClass } from '@mac/msd/constants';
import {
  ManufacturerSupplier,
  ManufacturerSupplierV2,
  Material,
  MaterialRequest,
  MaterialStandard,
  MaterialStandardV2,
  MaterialV2,
} from '@mac/msd/models';

export interface CreateMaterialRecord {
  standard: MaterialStandard | MaterialStandardV2;
  supplier: ManufacturerSupplier | ManufacturerSupplierV2;
  material: Material | MaterialV2 | MaterialRequest;

  materialClass: MaterialClass;

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
