import { ColDef } from '@ag-grid-enterprise/all-modules';

import { BOOLEAN_VALUE_GETTER } from './boolean-value-getter';
import { FILTER_PARAMS } from './filter-params';

export const MATERIAL_STANDARD_MATERIAL_NAME = 'materialStandardMaterialName';
export const MATERIAL_STANDARD_STANDARD_DOCUMENT =
  'materialStandardStandardDocument';
export const MATERIAL_NUMBERS = 'materialNumbers';
export const MANUFACTURER_SUPPLIER_NAME = 'manufacturerSupplierName';
export const MANUFACTURER_SUPPLIER_PLANT = 'manufacturerSupplierPlant';
export const SAP_SUPPLIER_IDS = 'sapSupplierIds';
export const MANUFACTURER_SUPPLIER_KIND = 'manufacturerSupplierKind';
export const MIN_DIMENSION = 'minDimension';
export const MAX_DIMENSION = 'maxDimension';
export const RATING_KIND_NAME = 'ratingKindName';
export const CO2_PER_TON = 'co2PerTon';
export const IS_PREMATERIAL = 'isPrematerial';
export const SHAPE_NAME = 'shapeName';
export const SHAPE_CODE = 'shapeCode';
export const CASTING_MODE = 'castingMode';
export const CASTING_DIAMETER = 'castingDiameter';
export const STEEL_MAKING_PROCESS = 'steelMakingProcess';
export const RELEASE_DATE_YEAR = 'releaseDateYear';
export const RELEASE_DATE_MONTH = 'releaseDateMonth';
export const RELEASE_RESTRICTIONS = 'releaseRestrictions';
export const ESR = 'esr';
export const VAR = 'var';
export const EXPORT = 'export';

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
    field: MANUFACTURER_SUPPLIER_KIND,
    headerName: 'Kind',
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
  },
  {
    field: RATING_KIND_NAME,
    headerName: 'Supplier Rating',
    filterParams: FILTER_PARAMS,
  },
  {
    field: CO2_PER_TON,
    headerName: 'kg CO₂e / t',
    filter: 'agNumberColumnFilter',
  },
  {
    field: IS_PREMATERIAL,
    headerName: 'Is Prematerial',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
  {
    field: SHAPE_NAME,
    headerName: 'Product Category',
    filterParams: FILTER_PARAMS,
  },
  {
    field: SHAPE_CODE,
    headerName: 'Product Category Code',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: CASTING_MODE,
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: CASTING_DIAMETER,
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: STEEL_MAKING_PROCESS,
    headerName: 'Steel Making Process',
    filterParams: FILTER_PARAMS,
    hide: true,
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
  {
    field: ESR,
    headerName: 'ESR',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
  {
    field: VAR,
    headerName: 'VAR',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
];
