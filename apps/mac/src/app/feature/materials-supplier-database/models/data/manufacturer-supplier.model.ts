export interface ManufacturerSupplier {
  id: number;
  name: string;
  plant: string;
  country: string;
  manufacturer?: boolean;
  sapData?: { sapSupplierId: string }[];
}
