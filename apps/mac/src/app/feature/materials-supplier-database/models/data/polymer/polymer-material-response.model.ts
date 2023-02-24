import {
  BaseMaterialResponse,
  PolymerManufacturerSupplier,
  PolymerMaterialStandard,
} from '@mac/msd/models';

export interface PolymerMaterialResponse extends BaseMaterialResponse {
  materialStandard: PolymerMaterialStandard;
  manufacturerSupplier: PolymerManufacturerSupplier;
  generalDescription?: string;
  referenceDoc?: string;
  releaseDateYear?: number;
  releaseDateMonth?: number;
}
