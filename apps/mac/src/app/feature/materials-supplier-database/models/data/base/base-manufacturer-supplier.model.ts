export interface BaseManufacturerSupplier {
  id: number;
  name: string;
  plant: string;
  country: string;
  modifiedBy?: string;
  timestamp?: number;
  sapIds?: string[];
}
