import {
  AluminumManufacturerSupplier,
  AluminumManufacturerSupplierForm,
  AluminumMaterial,
  AluminumMaterialForm,
  AluminumMaterialFormValue,
  AluminumMaterialRequest,
  AluminumMaterialResponse,
  AluminumMaterialStandard,
  AluminumMaterialStandardForm,
  SteelManufacturerSupplier,
  SteelManufacturerSupplierForm,
  SteelMaterial,
  SteelMaterialForm,
  SteelMaterialFormValue,
  SteelMaterialRequest,
  SteelMaterialResponse,
  SteelMaterialStandard,
  SteelMaterialStandardForm,
} from '@mac/msd/models';

// TODO: Rename to Material once the migration to API V3 is done
export type MaterialV2 = AluminumMaterial | SteelMaterial;
export type MaterialResponse = AluminumMaterialResponse | SteelMaterialResponse;
// TODO: Rename to ManufacturerSupplier once the migration to API V3 is done
export type ManufacturerSupplierV2 =
  | AluminumManufacturerSupplier
  | SteelManufacturerSupplier;
// TODO: Rename to MaterialStandard once the migration to API V3 is done
export type MaterialStandardV2 =
  | AluminumMaterialStandard
  | SteelMaterialStandard;
export type MaterialFormValueV2 =
  | AluminumMaterialFormValue
  | SteelMaterialFormValue;
export type MaterialForm = AluminumMaterialForm | SteelMaterialForm;
export type MaterialStandardForm =
  | AluminumMaterialStandardForm
  | SteelMaterialStandardForm;
export type ManufacturerSupplierForm =
  | AluminumManufacturerSupplierForm
  | SteelManufacturerSupplierForm;
export type MaterialRequest = AluminumMaterialRequest | SteelMaterialRequest;
