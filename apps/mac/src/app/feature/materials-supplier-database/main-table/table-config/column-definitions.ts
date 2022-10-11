import { ColDef } from 'ag-grid-enterprise';

import { EditCellRendererComponent } from '../edit-cell-renderer/edit-cell-renderer.component';
import { CUSTOM_DATE_FORMATTER } from './custom-date-formatter';
import { FILTER_PARAMS } from './filter-params';
import { MANUFACTURER_VALUE_GETTER } from './manufacturer-value-getter';
import { RELEASE_DATE_FORMATTER } from './release-date-formatter';
import { RELEASE_DATE_VALUE_GETTER } from './release-date-value-getter';

export const MATERIAL_STANDARD_MATERIAL_NAME = 'materialStandardMaterialName';
export const MATERIAL_STANDARD_STANDARD_DOCUMENT =
  'materialStandardStandardDocument';
export const MATERIAL_NUMBERS = 'materialNumbers';
export const MANUFACTURER_SUPPLIER_NAME = 'manufacturerSupplierName';
export const MANUFACTURER_SUPPLIER_PLANT = 'manufacturerSupplierPlant';
export const MANUFACTURER_SUPPLIER_SELFCERTIFIED =
  'manufacturerSupplierSelfCertified';
export const SAP_SUPPLIER_IDS = 'sapSupplierIds';
export const PRODUCT_CATEGORY = 'productCategoryText';
export const CO2_SCOPE_1 = 'co2Scope1';
export const CO2_SCOPE_2 = 'co2Scope2';
export const CO2_SCOPE_3 = 'co2Scope3';
export const CO2_PER_TON = 'co2PerTon';
export const CO2_CLASSIFICATION = 'co2Classification';
export const RELEASE_RESTRICTIONS = 'releaseRestrictions';
export const CASTING_MODE = 'castingMode';
export const CASTING_DIAMETER = 'castingDiameter';
export const MIN_DIMENSION = 'minDimension';
export const MAX_DIMENSION = 'maxDimension';
export const STEEL_MAKING_PROCESS = 'steelMakingProcess';
export const RATING = 'rating';
export const RATING_REMARK = 'ratingRemark';
export const LAST_MODIFIED = 'lastModified';
export const RELEASE_DATE = 'releaseDate';
export const MANUFACTURER = 'manufacturer';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: MATERIAL_STANDARD_MATERIAL_NAME,
    headerName: 'Material Name',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
    headerName: 'Standard Document',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_NAME,
    headerName: 'Supplier Name',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_PLANT,
    headerName: 'Supplier Plant',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER,
    headerName: 'Iron- & Steelmaking',
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
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
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MAX_DIMENSION,
    headerName: 'Max Dimension',
    filter: 'agNumberColumnFilter',
    tooltipField: MAX_DIMENSION,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING,
    headerName: 'Supplier Rating',
    filterParams: FILTER_PARAMS,
    tooltipField: RATING,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING_REMARK,
    headerName: 'Rating Remark',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_PER_TON,
    headerName: 'kg CO₂e / t',
    filter: 'agNumberColumnFilter',
    tooltipField: CO2_PER_TON,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_CLASSIFICATION,
    headerName: 'CO₂ Data Classification',
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: PRODUCT_CATEGORY,
    headerName: 'Product Category',
    filterParams: FILTER_PARAMS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_MODE,
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
    hide: true,
    tooltipField: CASTING_MODE,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_DIAMETER,
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
    hide: true,
    tooltipField: CASTING_DIAMETER,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: STEEL_MAKING_PROCESS,
    headerName: 'Steel Making Process',
    filterParams: FILTER_PARAMS,
    hide: true,
    tooltipField: STEEL_MAKING_PROCESS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RELEASE_DATE,
    headerName: 'Release Date',
    cellRenderer: EditCellRendererComponent,
    valueFormatter: RELEASE_DATE_FORMATTER,
    valueGetter: RELEASE_DATE_VALUE_GETTER,
    filter: 'agDateColumnFilter',
  },
  {
    field: RELEASE_RESTRICTIONS,
    headerName: 'Release Restrictions',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    headerName: 'Self Certified',
    hide: true,
    tooltipField: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
  },
  {
    field: LAST_MODIFIED,
    headerName: 'Last Modified',
    filter: 'agDateColumnFilter',
    valueFormatter: CUSTOM_DATE_FORMATTER,
    sort: 'desc',
  },
];
