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
  CopperManufacturerSupplierTableValue,
  CopperMaterial,
  CopperMaterialForm,
  CopperMaterialFormValue,
  CopperMaterialRequest,
  CopperMaterialResponse,
  CopperMaterialStandard,
  CopperMaterialStandardForm,
  CopperMaterialStandardFormValue,
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

import { CeramicMaterial } from '../ceramic/ceramic-material.model';
import {
  HardmagnetManufacturerSupplier,
  HardmagnetManufacturerSupplierForm,
  HardmagnetManufacturerSupplierFormValue,
  HardmagnetManufacturerSupplierTableValue,
  HardmagnetMaterialForm,
  HardmagnetMaterialFormValue,
  HardmagnetMaterialRequest,
  HardmagnetMaterialResponse,
  HardmagnetMaterialStandard,
  HardmagnetMaterialStandardForm,
  HardmagnetMaterialStandardFormValue,
  HardmagnetMaterialStandardTableValue,
} from '../hardmagnet';
import { HardmagnetMaterial } from '../hardmagnet/hardmagnet-material.model';

// TODO: Rename to Material once the migration to API V3 is done
export type Material =
  | AluminumMaterial
  | SteelMaterial
  | PolymerMaterial
  | CopperMaterial
  | HardmagnetMaterial
  | CeramicMaterial
  | SAPMaterial;
export type MaterialResponse =
  | AluminumMaterialResponse
  | SteelMaterialResponse
  | PolymerMaterialResponse
  | CopperMaterialResponse
  | HardmagnetMaterialResponse
  | CeramicMaterialResponse;
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
  | HardmagnetManufacturerSupplierForm
  | CeramicManufacturerSupplierForm;
export type ManufacturerSupplierFormValue =
  | AluminumManufacturerSupplierFormValue
  | SteelManufacturerSupplierFormValue
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
  | HardmagnetMaterialStandardTableValue
  | CeramicMaterialStandardTableValue;
