import { BaseManufacturerSupplier } from './base-manufacturer-supplier.model';
import { BaseMaterialStandard } from './base-material-standard.model';

export interface BaseMaterialResponse {
  id: number;
  materialStandard: BaseMaterialStandard;
  manufacturerSupplier: BaseManufacturerSupplier;
  materialClass: string;
  productCategory: string;
  co2Scope1?: number;
  co2Scope2?: number;
  co2Scope3?: number;
  co2PerTon?: number;
  co2Classification?: string;
  releaseRestrictions?: string;
  attachments?: string;
  sid?: number;
  modifiedBy?: string;
  timestamp?: number;
  historic?: boolean;
}
