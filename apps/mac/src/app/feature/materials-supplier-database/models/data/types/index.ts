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
  CopperManufacturerSupplier,
  CopperManufacturerSupplierForm,
  CopperManufacturerSupplierFormValue,
  CopperManufacturerSupplierTableValue,
  CopperMaterial,
  CopperMaterialForm,
  CopperMaterialFormValue,
  CopperMaterialRequest,
  CopperMaterialResponse,
  CopperMaterialStandard,
  CopperMaterialStandardForm,
  CopperMaterialStandardFormValue,
  CopperMaterialStandardTableValue,
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
export type MaterialV2 =
  | AluminumMaterial
  | SteelMaterial
  | PolymerMaterial
  | CopperMaterial;
export type MaterialResponse =
  | AluminumMaterialResponse
  | SteelMaterialResponse
  | PolymerMaterialResponse
  | CopperMaterialResponse;
// TODO: Rename to ManufacturerSupplier once the migration to API V3 is done
export type ManufacturerSupplierV2 =
  | AluminumManufacturerSupplier
  | SteelManufacturerSupplier
  | PolymerManufacturerSupplier
  | CopperManufacturerSupplier;
// TODO: Rename to MaterialStandard once the migration to API V3 is done
export type MaterialStandardV2 =
  | AluminumMaterialStandard
  | SteelMaterialStandard
  | PolymerMaterialStandard
  | CopperMaterialStandard;
export type MaterialFormValueV2 =
  | AluminumMaterialFormValue
  | SteelMaterialFormValue
  | CopperMaterialFormValue;
export type MaterialForm =
  | AluminumMaterialForm
  | SteelMaterialForm
  | CopperMaterialForm;
export type MaterialStandardForm =
  | AluminumMaterialStandardForm
  | SteelMaterialStandardForm
  | CopperMaterialStandardForm;
export type MaterialStandardFormValue =
  | AluminumMaterialStandardFormValue
  | SteelMaterialStandardFormValue
  | CopperMaterialStandardFormValue;
export type ManufacturerSupplierForm =
  | AluminumManufacturerSupplierForm
  | SteelManufacturerSupplierForm
  | CopperManufacturerSupplierForm;
export type ManufacturerSupplierFormValue =
  | AluminumManufacturerSupplierFormValue
  | SteelManufacturerSupplierFormValue
  | CopperManufacturerSupplierFormValue;
export type MaterialRequest =
  | AluminumMaterialRequest
  | SteelMaterialRequest
  | CopperMaterialRequest;
export type ManufacturerSupplierTableValue =
  | AluminumManufacturerSupplierTableValue
  | PolymerManufacturerSupplierTableValue
  | SteelManufacturerSupplierTableValue
  | CopperManufacturerSupplierTableValue;
export type MaterialStandardTableValue =
  | AluminumMaterialStandardTableValue
  | PolymerMaterialStandardTableValue
  | SteelMaterialStandardTableValue
  | CopperMaterialStandardTableValue;
