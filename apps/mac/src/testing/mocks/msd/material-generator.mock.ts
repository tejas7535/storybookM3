import { StringOption } from '@schaeffler/inputs';

import { MaterialClass } from '@mac/feature/materials-supplier-database/constants';
import {
  findProperty,
  mapProperty,
} from '@mac/feature/materials-supplier-database/main-table/material-input-dialog/util/form-helpers';
import {
  ManufacturerSupplier,
  MaterialFormValue,
  MaterialRequest,
  MaterialStandard,
} from '@mac/feature/materials-supplier-database/models';

export const createOption = (
  title: string,
  id: number | string = 7,
  data?: any
) => ({ id, title, data } as StringOption);

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
  const standard: MaterialStandard = {
    id: values.materialStandardId,
    materialName: values.materialName.title,
    standardDocument: values.standardDocument.title,
    // steel |copper only
    materialNumber: mapProperty<string>(values, 'materialNumber', (val) =>
      val.length > 0 ? val.split(',') : undefined
    ),
  };
  const supplier: ManufacturerSupplier = {
    id: values.manufacturerSupplierId,
    name: values.supplier.title,
    plant: values.supplierPlant.title,
    country: values.supplierCountry.id as string,
    // steel only
    manufacturer: findProperty(values, 'manufacturer'),
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
    releaseRestrictions: values.releaseRestrictions,
    referenceDoc: findProperty<StringOption[]>(values, 'referenceDoc')?.map(
      (so) => so.title
    ),
    castingMode: findProperty(values, 'castingMode'),
    minDimension: findProperty(values, 'minDimension'),
    maxDimension: findProperty(values, 'maxDimension'),
    castingDiameter: findProperty<StringOption>(values, 'castingDiameter')
      ?.title,
    steelMakingProcess: findProperty<StringOption>(values, 'steelMakingProcess')
      ?.id as string,
    productionProcess: findProperty<StringOption>(values, 'productionProcess')
      ?.id as string,
    rating: findProperty<StringOption>(values, 'rating')?.id as string,
    ratingChangeComment: findProperty(values, 'ratingChangeComment'),
    ratingRemark: findProperty(values, 'ratingRemark'),
    releaseDateMonth: findProperty(values, 'releaseDateMonth'),
    releaseDateYear: findProperty(values, 'releaseDateYear'),
    selfCertified: findProperty(values, 'selfCertified'),
    minRecyclingRate: findProperty(values, 'minRecyclingRate'),
    maxRecyclingRate: findProperty(values, 'maxRecyclingRate'),
    condition: findProperty<StringOption>(values, 'condition')?.id as string,
    blocked: findProperty(values, 'blocked'),
  };

  return { standard, supplier, material };
};
