export interface BaseMaterialRequest {
  id: number;
  materialStandardId: number;
  manufacturerSupplierId: number;
  co2Scope1?: number;
  co2Scope2?: number;
  co2Scope3?: number;
  co2PerTon?: number;
  productCategory?: string;
  co2Classification?: string;
  releaseRestrictions?: string;
  attachments?: string;
  sid?: number;
  modifiedBy?: string;
  timestamp?: number;
  historic?: boolean;
}
