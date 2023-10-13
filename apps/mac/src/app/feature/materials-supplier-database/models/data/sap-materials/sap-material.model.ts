export interface SAPMaterial {
  materialNumber: string;
  materialDescription: string;
  materialGroup: string;
  materialGroupText: string;
  category: string;
  categoryText: string;
  businessPartnerId: string;
  supplierId: string;
  supplierIdText: string;
  plant: string;
  plantText: string;
  supplierCountry: string;
  supplierRegion: string;
  emissionFactorKg: number;
  emissionFactorPc: number;
  transportPc: string;
  transportIncoterm: string;
  dataDate: number;
  dataComment: string;
  owner: string;
  maturity: number;
  modifiedBy: string;
  timestamp: number;
  historic: boolean;
  uploadId: string;
}

export interface SAPMaterialHistoryValue {
  materialNumber: string;
  materialDescription: string;
  materialGroup: string;
  category: string;
  businessPartnerId: string;
  supplierId: string;
  plant: string;
  supplierCountry: string;
  supplierRegion: string;
  emissionFactorKg: number;
  emissionFactorPc: number;
  transportPc: string;
  transportIncoterm: string;
  dataDate: string;
  dataComment: string;
  owner: string;
  maturity: number;
  modifiedBy: string;
  lastModified: number;
}
