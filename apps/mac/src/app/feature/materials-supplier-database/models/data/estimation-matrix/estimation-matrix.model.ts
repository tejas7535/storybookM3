export interface EstimationMatrix {
  id: number;
  mappingId: string;
  productGroup: string;
  productGroupId: string;
  supplierCountryCode: string;
  supplierRegionCode: string;
  pcfMaterial: number;
  materialUtilization: number;
  pcfProcess: number;
  pcfPerKg: number;
  comment: string;
  version: string;
  releaseDate: string;
  timestamp: number;
}
