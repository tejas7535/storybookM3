import {
  AluminiumManufacturerSupplier,
  AluminiumMaterial,
  AluminiumMaterialResponse,
  AluminiumMaterialStandard,
  SteelManufacturerSupplier,
  SteelMaterial,
  SteelMaterialResponse,
  SteelMaterialStandard,
} from '@mac/msd/models';

// TODO: Rename to Material once the migration to API V3 is done
export type MaterialV2 = AluminiumMaterial | SteelMaterial;
export type MaterialResponse =
  | AluminiumMaterialResponse
  | SteelMaterialResponse;
// TODO: Rename to ManufacturerSupplier once the migration to API V3 is done
export type ManufacturerSupplierV2 =
  | AluminiumManufacturerSupplier
  | SteelManufacturerSupplier;
// TODO: Rename to MaterialStandard once the migration to API V3 is done
export type MaterialStandardV2 =
  | AluminiumMaterialStandard
  | SteelMaterialStandard;
