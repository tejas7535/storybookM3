import { BaseMaterial } from '@mac/msd/models';

export interface PolymerMaterial extends BaseMaterial {
  sapSupplierIds?: string[];
  ssid?: string;
  generalDescription?: string;
  materialNumbers?: string[];
  referenceDoc?: string;
  releaseDateYear?: number;
  releaseDateMonth?: number;
}
