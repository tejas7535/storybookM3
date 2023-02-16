import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  ManufacturerSupplierV2,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandardV2,
} from '@mac/feature/materials-supplier-database/models';

export const createOption = (title: string, id = 7, data?: any) =>
  ({ id, title, data } as StringOption);

export const rndStr = (length = 8) => {
  const chars =
    '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }

  return result;
};

export const rndNum = () => Math.floor(Math.random() * 1000);
export const rndBool = () => Math.random() > 0.5;
export const rndOpt = () => createOption(rndStr(), rndNum());

export const createMaterialFormValue = (
  type: MaterialClass = MaterialClass.STEEL
) => {
  let base = {
    materialStandardId: rndNum(),
    materialName: rndOpt(),
    standardDocument: rndOpt(),

    manufacturerSupplierId: rndNum(),
    supplier: rndOpt(),
    supplierPlant: rndOpt(),
    supplierCountry: rndOpt(),

    productCategory: rndOpt(),
    co2Scope1: rndNum(),
    co2Scope2: rndNum(),
    co2Scope3: rndNum(),
    co2PerTon: rndNum(),
    co2Classification: rndOpt(),
    releaseRestrictions: rndStr(),
  } as MaterialFormValue;

  if (type === MaterialClass.STEEL) {
    base = {
      ...base,

      referenceDoc: [rndOpt()],
      releaseDateMonth: rndNum(),
      releaseDateYear: rndNum(),
      blocked: rndBool(),
      castingMode: rndStr(),
      castingDiameter: rndOpt(),
      manufacturer: rndBool(),
      materialNumber: rndStr(),
      maxDimension: rndNum(),
      minDimension: rndNum(),
      rating: rndOpt(),
      ratingChangeComment: rndStr(),
      ratingRemark: rndStr(),
      selfCertified: rndBool(),
      steelMakingProcess: rndOpt(),
    };
  }

  if (type === MaterialClass.COPPER) {
    base = {
      ...base,

      productionProcess: rndOpt(),
      referenceDoc: [rndOpt()],
      castingMode: rndStr(),
      castingDiameter: rndOpt(),
      maxDimension: rndNum(),
    };
  }

  if (type === MaterialClass.CERAMIC) {
    return {
      ...base,
      condition: rndOpt(),
    };
  }

  return base;
};

export const createMaterialRequest = (
  type: MaterialClass = MaterialClass.STEEL
) => transformAsMaterialRequest(createMaterialFormValue(type));

export const transformAsMaterialRequest = (values: MaterialFormValue) => {
  // confirmation
  const standard: MaterialStandardV2 = {
    id: values.materialStandardId,
    materialName: values.materialName.title,
    standardDocument: values.standardDocument.title,
    // steel only
    materialNumber:
      values.materialNumber?.length > 0
        ? values.materialNumber?.split(',')
        : undefined,
  };
  const supplier: ManufacturerSupplierV2 = {
    id: values.manufacturerSupplierId,
    name: values.supplier.title,
    plant: values.supplierPlant.title,
    country: values.supplierCountry.title,
    // steel only
    manufacturer: values.manufacturer,
  };
  const material: MaterialRequest = {
    id: undefined,
    materialStandardId: values.materialStandardId,
    manufacturerSupplierId: values.manufacturerSupplierId,
    co2Scope1: values.co2Scope1,
    co2Scope2: values.co2Scope2,
    co2Scope3: values.co2Scope3,
    co2PerTon: values.co2PerTon,
    co2Classification: values.co2Classification.id as string,
    productCategory: values.productCategory.id as string,
    // steel only
    referenceDoc: values.referenceDoc
      ? `["${values.referenceDoc[0].title}"]`
      : undefined,
    castingMode: values.castingMode,
    minDimension: values.minDimension,
    maxDimension: values.maxDimension,
    castingDiameter: values.castingDiameter?.title,
    steelMakingProcess: values.steelMakingProcess?.id as string,
    productionProcess: values.productionProcess?.id as string,
    rating: values.rating?.id as string,
    ratingChangeComment: values.ratingChangeComment,
    ratingRemark: values.ratingRemark,
    releaseRestrictions: values.releaseRestrictions,
    releaseDateMonth: values.releaseDateMonth,
    releaseDateYear: values.releaseDateYear,
    selfCertified: values.selfCertified,
    recyclingRate: values.recyclingRate,
    condition: values.condition?.id as string,
    blocked: values.blocked,
  };

  return { standard, supplier, material };
};
