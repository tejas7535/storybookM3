import { BaseMaterial } from '@mac/msd/models';

export interface PolymerMaterial extends BaseMaterial {
  sapSupplierIds?: string[];
  generalDescription?: string;
  materialNumbers?: string[];
  referenceDoc?: string[];
  releaseDateYear?: number;
  releaseDateMonth?: number;
}
