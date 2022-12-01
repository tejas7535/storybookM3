import { MaterialClass } from '@mac/msd/constants';

export interface BaseMaterial {
  id?: number;
  materialStandardId: number;
  materialStandardMaterialName: string;
  materialStandardStandardDocument: string;
  materialStandardMaterialNumber?: string;
  manufacturerSupplierId: number;
  manufacturerSupplierName?: string;
  manufacturerSupplierPlant?: string;
  manufacturerSupplierCountry?: string;
  materialClass: MaterialClass;
  productCategory?: string;
  productCategoryText?: string;
  co2Scope1?: number;
  co2Scope2?: number;
  co2Scope3?: number;
  co2PerTon?: number;
  co2Classification?: string;
  releaseRestrictions?: string;
  attachments?: string;
  modifiedBy?: string;
  lastModified?: number;
}
