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
  CeramicManufacturerSupplier,
  CeramicManufacturerSupplierForm,
  CeramicManufacturerSupplierFormValue,
  CeramicManufacturerSupplierTableValue,
  CeramicMaterial,
  CeramicMaterialForm,
  CeramicMaterialFormValue,
  CeramicMaterialRequest,
  CeramicMaterialResponse,
  CeramicMaterialStandard,
  CeramicMaterialStandardForm,
  CeramicMaterialStandardFormValue,
  CeramicMaterialStandardTableValue,
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
  LubricantMaterial,
  LubricantMaterialResponse,
  PolymerManufacturerSupplier,
  PolymerManufacturerSupplierTableValue,
  PolymerMaterial,
  PolymerMaterialResponse,
  PolymerMaterialStandard,
  PolymerMaterialStandardTableValue,
  SAPMaterial,
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

export type Material =
  | AluminumMaterial
  | SteelMaterial
  | PolymerMaterial
  | CopperMaterial
  | CeramicMaterial
  | SAPMaterial
  | LubricantMaterial;
export type MaterialResponse =
  | AluminumMaterialResponse
  | SteelMaterialResponse
  | PolymerMaterialResponse
  | CopperMaterialResponse
  | CeramicMaterialResponse
  | LubricantMaterialResponse;
export type ManufacturerSupplier =
  | AluminumManufacturerSupplier
  | SteelManufacturerSupplier
  | PolymerManufacturerSupplier
  | CopperManufacturerSupplier
  | CeramicManufacturerSupplier;
export type MaterialStandard =
  | AluminumMaterialStandard
  | SteelMaterialStandard
  | PolymerMaterialStandard
  | CopperMaterialStandard
  | CeramicMaterialStandard;
export type MaterialFormValue =
  | AluminumMaterialFormValue
  | SteelMaterialFormValue
  | CopperMaterialFormValue
  | CeramicMaterialFormValue;
export type MaterialForm =
  | AluminumMaterialForm
  | SteelMaterialForm
  | CopperMaterialForm
  | CeramicMaterialForm;
export type MaterialStandardForm =
  | AluminumMaterialStandardForm
  | SteelMaterialStandardForm
  | CopperMaterialStandardForm
  | CeramicMaterialStandardForm;
export type MaterialStandardFormValue =
  | AluminumMaterialStandardFormValue
  | SteelMaterialStandardFormValue
  | CopperMaterialStandardFormValue
  | CeramicMaterialStandardFormValue;
export type ManufacturerSupplierForm =
  | AluminumManufacturerSupplierForm
  | SteelManufacturerSupplierForm
  | CopperManufacturerSupplierForm
  | CeramicManufacturerSupplierForm;
export type ManufacturerSupplierFormValue =
  | AluminumManufacturerSupplierFormValue
  | SteelManufacturerSupplierFormValue
  | CopperManufacturerSupplierFormValue
  | CeramicManufacturerSupplierFormValue;
export type MaterialRequest =
  | AluminumMaterialRequest
  | SteelMaterialRequest
  | CopperMaterialRequest
  | CeramicMaterialRequest;
export type ManufacturerSupplierTableValue =
  | AluminumManufacturerSupplierTableValue
  | PolymerManufacturerSupplierTableValue
  | SteelManufacturerSupplierTableValue
  | CopperManufacturerSupplierTableValue
  | CeramicManufacturerSupplierTableValue;
export type MaterialStandardTableValue =
  | AluminumMaterialStandardTableValue
  | PolymerMaterialStandardTableValue
  | SteelMaterialStandardTableValue
  | CopperMaterialStandardTableValue
  | CeramicMaterialStandardTableValue;
