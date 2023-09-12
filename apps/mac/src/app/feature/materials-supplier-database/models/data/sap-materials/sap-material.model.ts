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
  dataSourceId: string;
  owner: string;
  name: string;
}
