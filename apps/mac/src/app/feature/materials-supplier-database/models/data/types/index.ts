import {
  AluminumManufacturerSupplier,
  AluminumManufacturerSupplierForm,
  AluminumManufacturerSupplierFormValue,
  AluminumManufacturerSupplierTableValue,
  AluminumMaterial,
  AluminumMaterialForm,
  AluminumMaterialFormValue,
  AluminumMaterialRequest,
  AluminumMaterialResponse,
  AluminumMaterialStandard,
  AluminumMaterialStandardForm,
  AluminumMaterialStandardFormValue,
  AluminumMaterialStandardTableValue,
  PolymerManufacturerSupplier,
  PolymerManufacturerSupplierTableValue,
  PolymerMaterial,
  PolymerMaterialResponse,
  PolymerMaterialStandard,
  PolymerMaterialStandardTableValue,
  SteelManufacturerSupplier,
  SteelManufacturerSupplierForm,
  SteelManufacturerSupplierFormValue,
  SteelManufacturerSupplierTableValue,
  SteelMaterial,
  SteelMaterialForm,
  SteelMaterialFormValue,
  SteelMaterialRequest,
  SteelMaterialResponse,
  SteelMaterialStandard,
  SteelMaterialStandardForm,
  SteelMaterialStandardFormValue,
  SteelMaterialStandardTableValue,
} from '@mac/msd/models';

// TODO: Rename to Material once the migration to API V3 is done
export type MaterialV2 = AluminumMaterial | SteelMaterial | PolymerMaterial;
export type MaterialResponse =
  | AluminumMaterialResponse
  | SteelMaterialResponse
  | PolymerMaterialResponse;
// TODO: Rename to ManufacturerSupplier once the migration to API V3 is done
export type ManufacturerSupplierV2 =
  | AluminumManufacturerSupplier
  | SteelManufacturerSupplier
  | PolymerManufacturerSupplier;
// TODO: Rename to MaterialStandard once the migration to API V3 is done
export type MaterialStandardV2 =
  | AluminumMaterialStandard
  | SteelMaterialStandard
  | PolymerMaterialStandard;
export type MaterialFormValueV2 =
  | AluminumMaterialFormValue
  | SteelMaterialFormValue;
export type MaterialForm = AluminumMaterialForm | SteelMaterialForm;
export type MaterialStandardForm =
  | AluminumMaterialStandardForm
  | SteelMaterialStandardForm;
export type MaterialStandardFormValue =
  | AluminumMaterialStandardFormValue
  | SteelMaterialStandardFormValue;
export type ManufacturerSupplierForm =
  | AluminumManufacturerSupplierForm
  | SteelManufacturerSupplierForm;
export type ManufacturerSupplierFormValue =
  | AluminumManufacturerSupplierFormValue
  | SteelManufacturerSupplierFormValue;
export type MaterialRequest = AluminumMaterialRequest | SteelMaterialRequest;
export type ManufacturerSupplierTableValue =
  | AluminumManufacturerSupplierTableValue
  | PolymerManufacturerSupplierTableValue
  | SteelManufacturerSupplierTableValue;
export type MaterialStandardTableValue =
  | AluminumMaterialStandardTableValue
  | PolymerMaterialStandardTableValue
  | SteelMaterialStandardTableValue;
