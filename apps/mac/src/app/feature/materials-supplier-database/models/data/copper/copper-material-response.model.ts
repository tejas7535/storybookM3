import {
  BaseMaterialResponse,
  CopperManufacturerSupplier,
  CopperMaterialStandard,
} from '@mac/msd/models';

export interface CopperMaterialResponse extends BaseMaterialResponse {
  materialStandard: CopperMaterialStandard;
  manufacturerSupplier: CopperManufacturerSupplier;
  productCategory: string;
  referenceDoc?: string;
  castingMode: string;
  castingDiameter: string;
  maxDimension: number;
  productionProcess?: string;
}
