import { MaterialClass } from '@mac/msd/constants';

export interface BaseMaterial {
  id?: number;
  materialStandardId: number;
  materialStandardMaterialName: string;
  materialStandardStandardDocument: string;

  manufacturerSupplierId: number;
  manufacturerSupplierName?: string;
  manufacturerSupplierPlant?: string;
  manufacturerSupplierCountry?: string;
  manufacturerSupplierRegion?: string;
  manufacturerSupplierSapSupplierIds?: string[];
  manufacturerSupplierBusinessPartnerIds?: number[];

  materialClass: MaterialClass;

  co2Scope1?: number;
  co2Scope2?: number;
  co2Scope3?: number;
  co2PerTon?: number;
  productCategory?: string;
  productCategoryText?: string;
  co2Classification?: string;
  releaseRestrictions?: string;
  attachments?: string;
  modifiedBy?: string;
  lastModified?: number;
}
