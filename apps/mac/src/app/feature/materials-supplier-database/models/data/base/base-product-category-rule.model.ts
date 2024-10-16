import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';

export interface BaseProductCategoryRule {
  id: number;
  materialClass: MaterialClass;
  title: string;
  timestamp: number;
  validUntil: number;
  uploadFile: {
    id: number;
    type: string;
    filename: string;
    azureReference: string;
  };
  allocationToSideProducts: boolean;
  version: string;
  modifiedBy: string;
}
