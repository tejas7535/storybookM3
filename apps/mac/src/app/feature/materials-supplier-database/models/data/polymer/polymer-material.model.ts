import { BaseMaterial } from '@mac/msd/models';

export interface PolymerMaterial extends BaseMaterial {
  sapSupplierIds?: string[];
  ssid?: string;
  generalDescription?: string;
  sapMaterialNumber?: string;
  referenceDoc?: string;
  releaseDateYear?: number;
  releaseDateMonth?: number;
}
