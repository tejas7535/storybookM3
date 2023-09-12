export interface BaseManufacturerSupplierTableValue {
  id?: number;
  manufacturerSupplierName?: string;
  manufacturerSupplierPlant?: string;
  manufacturerSupplierCountry?: string;
  manufacturerSupplierRegion?: string;
  modifiedBy?: string;
  lastModified?: number;
  manufacturerSupplierSapSupplierIds?: string[];
  manufacturerSupplierBusinessPartnerIds?: number[];
}
