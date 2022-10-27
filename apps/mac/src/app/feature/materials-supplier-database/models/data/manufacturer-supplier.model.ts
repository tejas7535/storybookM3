export interface ManufacturerSupplier {
  id: number;
  name: string;
  plant: string;
  manufacturer?: boolean;
  sapData?: { sapSupplierId: string }[];
}
