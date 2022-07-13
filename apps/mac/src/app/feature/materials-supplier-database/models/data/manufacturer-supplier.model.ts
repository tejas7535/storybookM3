export interface ManufacturerSupplier {
  id: number;
  name: string;
  plant: string;
  sapData?: { sapSupplierId: string }[];
}
