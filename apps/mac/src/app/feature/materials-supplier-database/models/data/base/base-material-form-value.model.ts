import { StringOption } from '@schaeffler/inputs';

export interface BaseMaterialFormValue {
  productCategory: StringOption;
  manufacturerSupplierId: number;
  materialStandardId: number;
  co2Scope1: number;
  co2Scope2: number;
  co2Scope3: number;
  co2PerTon: number;
  co2Classification: StringOption;
  releaseRestrictions: string;
  co2UploadFile?: File;
  co2UploadFileId?: number;

  standardDocument: StringOption;
  materialName: StringOption;
  supplier: StringOption;
  supplierPlant: StringOption;
  supplierCountry: StringOption;
  businessPartnerIds?: StringOption[];
}
