export interface MaterialResponseEntry {
  id: number;
  materialClass: string;
  materialStandard: {
    id: number;
    materialName: string;
    standardDocument: string;
    materialNumber: string;
  };
  manufacturerSupplier: {
    id: number;
    name: string;
    plant: string;
    sapData?: {
      sapSupplierId: string;
    }[];
  };
  productCategory: string;
  referenceDoc?: string;
  co2Scope1?: number;
  co2Scope2?: number;
  co2Scope3?: number;
  co2PerTon?: number;
  co2Classification?: string;
  releaseDateYear: number;
  releaseDateMonth: number;
  releaseRestrictions?: string;
  castingMode: string;
  castingDiameter: string;
  minDimension?: number;
  maxDimension: number;
  steelMakingProcess?: string;
  rating?: string;
  ratingRemark?: string;
  ratingChangeComment?: string;
}
