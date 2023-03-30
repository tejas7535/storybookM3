export interface SAPMaterial {
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
  dataDate: number;
  dataComment: string;
  dataSourceId: string;
  owner: string;
  name: string;
}
