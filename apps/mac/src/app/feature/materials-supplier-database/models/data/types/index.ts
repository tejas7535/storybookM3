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

import { CeramicMaterial } from '../ceramic/ceramic-material.model';

// TODO: Rename to Material once the migration to API V3 is done
export type MaterialV2 =
  | AluminumMaterial
  | SteelMaterial
  | PolymerMaterial
  | CopperMaterial
  | CeramicMaterial;
export type MaterialResponse =
  | AluminumMaterialResponse
  | SteelMaterialResponse
  | PolymerMaterialResponse
  | CopperMaterialResponse
  | CeramicMaterialResponse;
// TODO: Rename to ManufacturerSupplier once the migration to API V3 is done
export type ManufacturerSupplierV2 =
  | AluminumManufacturerSupplier
  | SteelManufacturerSupplier
  | PolymerManufacturerSupplier
  | CopperManufacturerSupplier
  | CeramicManufacturerSupplier;
// TODO: Rename to MaterialStandard once the migration to API V3 is done
export type MaterialStandardV2 =
  | AluminumMaterialStandard
  | SteelMaterialStandard
  | PolymerMaterialStandard
  | CopperMaterialStandard
  | CeramicMaterialStandard;
export type MaterialFormValueV2 =
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
