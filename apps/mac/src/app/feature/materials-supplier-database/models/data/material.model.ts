export interface Material {
  id?: number;
  materialClass: string;
  materialStandardId: number;
  manufacturerSupplierId: number;
  productCategory: string;
  referenceDoc?: string;
  co2Scope1?: number;
  co2Scope2?: number;
  co2Scope3?: number;
  co2PerTon?: number;
  co2Classification: string;
  releaseDateYear: number;
  releaseDateMonth: number;
  releaseRestrictions?: string;
  blocked: boolean;
  attachments?: string;
  castingMode: string;
  castingDiameter: string;
  minDimension?: number;
  maxDimension: number;
  steelMakingProcess?: string;
  rating: string;
  ratingRemark: string;
  ratingChangeComment?: string;
}
