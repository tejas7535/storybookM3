import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';

export interface BaseProductCategoryRuleTableValue {
  id: number;
  materialClass: MaterialClass;
  title: string;
  lastModified: number;
  validUntil: number;
  uploadFileId: number;
  filename: string;
  allocationToSideProducts: boolean;
  version: string;
  modifiedBy: string;
}
