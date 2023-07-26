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
  HardmagnetManufacturerSupplier,
  HardmagnetManufacturerSupplierForm,
  HardmagnetManufacturerSupplierFormValue,
  HardmagnetManufacturerSupplierTableValue,
  HardmagnetMaterial,
  HardmagnetMaterialForm,
  HardmagnetMaterialFormValue,
  HardmagnetMaterialRequest,
  HardmagnetMaterialResponse,
  HardmagnetMaterialStandard,
  HardmagnetMaterialStandardForm,
  HardmagnetMaterialStandardFormValue,
  HardmagnetMaterialStandardTableValue,
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
  | HardmagnetMaterial
  | CeramicMaterial
  | SAPMaterial
  | LubricantMaterial;
export type MaterialResponse =
  | AluminumMaterialResponse
  | SteelMaterialResponse
  | PolymerMaterialResponse
  | CopperMaterialResponse
  | HardmagnetMaterialResponse
  | CeramicMaterialResponse
  | LubricantMaterialResponse;
export type ManufacturerSupplier =
  | AluminumManufacturerSupplier
  | SteelManufacturerSupplier
  | PolymerManufacturerSupplier
  | CopperManufacturerSupplier
  | HardmagnetManufacturerSupplier
  | CeramicManufacturerSupplier;
export type MaterialStandard =
  | AluminumMaterialStandard
  | SteelMaterialStandard
  | PolymerMaterialStandard
  | CopperMaterialStandard
  | CeramicMaterialStandard
  | HardmagnetMaterialStandard;
export type MaterialFormValue =
  | AluminumMaterialFormValue
  | SteelMaterialFormValue
  | CopperMaterialFormValue
  | HardmagnetMaterialFormValue
  | CeramicMaterialFormValue;
export type MaterialForm =
  | AluminumMaterialForm
  | SteelMaterialForm
  | CopperMaterialForm
  | HardmagnetMaterialForm
  | CeramicMaterialForm;
export type MaterialStandardForm =
  | AluminumMaterialStandardForm
  | SteelMaterialStandardForm
  | CopperMaterialStandardForm
  | HardmagnetMaterialStandardForm
  | CeramicMaterialStandardForm;
export type MaterialStandardFormValue =
  | AluminumMaterialStandardFormValue
  | SteelMaterialStandardFormValue
  | CopperMaterialStandardFormValue
  | HardmagnetMaterialStandardFormValue
  | CeramicMaterialStandardFormValue;
export type ManufacturerSupplierForm =
  | AluminumManufacturerSupplierForm
  | SteelManufacturerSupplierForm
  | CopperManufacturerSupplierForm
  | HardmagnetManufacturerSupplierForm
  | CeramicManufacturerSupplierForm;
export type ManufacturerSupplierFormValue =
  | AluminumManufacturerSupplierFormValue
  | SteelManufacturerSupplierFormValue
  | CopperManufacturerSupplierFormValue
  | HardmagnetManufacturerSupplierFormValue
  | CeramicManufacturerSupplierFormValue;
export type MaterialRequest =
  | AluminumMaterialRequest
  | SteelMaterialRequest
  | CopperMaterialRequest
  | HardmagnetMaterialRequest
  | CeramicMaterialRequest;
export type ManufacturerSupplierTableValue =
  | AluminumManufacturerSupplierTableValue
  | PolymerManufacturerSupplierTableValue
  | SteelManufacturerSupplierTableValue
  | CopperManufacturerSupplierTableValue
  | HardmagnetManufacturerSupplierTableValue
  | CeramicManufacturerSupplierTableValue;
export type MaterialStandardTableValue =
  | AluminumMaterialStandardTableValue
  | PolymerMaterialStandardTableValue
  | SteelMaterialStandardTableValue
  | CopperMaterialStandardTableValue
  | HardmagnetMaterialStandardTableValue
  | CeramicMaterialStandardTableValue;
