import { ColDef } from '@ag-grid-enterprise/all-modules';

import { FILTER_PARAMS } from './filter-params';

export const MATERIAL_STANDARD_MATERIAL_NAME = 'materialStandardMaterialName';
export const MATERIAL_STANDARD_STANDARD_DOCUMENT =
  'materialStandardStandardDocument';
export const MATERIAL_NUMBERS = 'materialNumbers';
export const MANUFACTURER_SUPPLIER_NAME = 'manufacturerSupplierName';
export const MANUFACTURER_SUPPLIER_PLANT = 'manufacturerSupplierPlant';
export const SAP_SUPPLIER_IDS = 'sapSupplierIds';
export const PRODUCT_CATEGORY = 'productCategoryText';
export const CO2_SCOPE_1 = 'co2Scope1';
export const CO2_SCOPE_2 = 'co2Scope2';
export const CO2_SCOPE_3 = 'co2Scope3';
export const CO2_PER_TON = 'co2PerTon';
export const CO2_CLASSIFICATION = 'co2Classification';
export const RELEASE_DATE_YEAR = 'releaseDateYear';
export const RELEASE_DATE_MONTH = 'releaseDateMonth';
export const RELEASE_RESTRICTIONS = 'releaseRestrictions';
export const CASTING_MODE = 'castingMode';
export const CASTING_DIAMETER = 'castingDiameter';
export const MIN_DIMENSION = 'minDimension';
export const MAX_DIMENSION = 'maxDimension';
export const STEEL_MAKING_PROCESS = 'steelMakingProcess';
export const RATING = 'rating';
export const RATING_REMARK = 'ratingRemark';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: MATERIAL_STANDARD_MATERIAL_NAME,
    headerName: 'Material Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    headerName: 'Standard Document',
    filterParams: FILTER_PARAMS,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: MANUFACTURER_SUPPLIER_NAME,
    headerName: 'Supplier Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: MANUFACTURER_SUPPLIER_PLANT,
    headerName: 'Supplier Plant',
    filterParams: FILTER_PARAMS,
  },
  {
    field: SAP_SUPPLIER_IDS,
    headerName: 'SAP Supplier ID(s)',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: MIN_DIMENSION,
    headerName: 'Min Dimension',
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: MAX_DIMENSION,
    headerName: 'Max Dimension',
    filter: 'agNumberColumnFilter',
    tooltipField: MAX_DIMENSION,
  },
  {
    field: RATING,
    headerName: 'Supplier Rating',
    filterParams: FILTER_PARAMS,
    tooltipField: RATING,
  },
  {
    field: RATING_REMARK,
    headerName: 'Rating Remark',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: CO2_PER_TON,
    headerName: 'kg CO₂e / t',
    filter: 'agNumberColumnFilter',
    tooltipField: CO2_PER_TON,
  },
  {
    field: CO2_CLASSIFICATION,
    headerName: 'CO₂ Data Classification',
    hide: true,
  },
  {
    field: PRODUCT_CATEGORY,
    headerName: 'Product Category',
    filterParams: FILTER_PARAMS,
  },
  {
    field: CASTING_MODE,
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
    hide: true,
    tooltipField: CASTING_MODE,
  },
  {
    field: CASTING_DIAMETER,
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
    hide: true,
    tooltipField: CASTING_DIAMETER,
  },
  {
    field: STEEL_MAKING_PROCESS,
    headerName: 'Steel Making Process',
    filterParams: FILTER_PARAMS,
    hide: true,
    tooltipField: STEEL_MAKING_PROCESS,
  },
  {
    field: RELEASE_DATE_YEAR,
    headerName: 'Release Date Year',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: RELEASE_DATE_MONTH,
    headerName: 'Release Date Month',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: RELEASE_RESTRICTIONS,
    headerName: 'Release Restrictions',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
];
