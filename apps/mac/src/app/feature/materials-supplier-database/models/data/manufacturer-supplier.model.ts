export interface ManufacturerSupplier {
  id: number;
  name: string;
  plant: string;
  selfCertified: boolean;
  sapData?: { sapSupplierId: string }[];
}
