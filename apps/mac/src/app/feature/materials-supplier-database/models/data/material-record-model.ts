import { MaterialClass } from '@mac/msd/constants';
import {
  ManufacturerSupplier,
  MaterialRequest,
  MaterialStandard,
} from '@mac/msd/models';

export interface CreateMaterialRecord {
  standard: MaterialStandard;
  supplier: ManufacturerSupplier;
  material: MaterialRequest;
  materialClass: MaterialClass;

  error?: {
    code: number;
    state: CreateMaterialErrorState;
  };
}

export enum CreateMaterialErrorState {
  MaterialStandardCreationFailed = 'matStandard',
  ManufacturerSupplierCreationFailed = 'supplier',
  MaterialCreationFailed = 'material',
}
