import { ColDef } from '@ag-grid-enterprise/all-modules';

import { FILTER_PARAMS } from './filter-params';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'manufacturerSupplierName',
    headerName: 'Manufacturer Supplier',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'manufacturerSupplierPlant',
    headerName: 'Manufacturer Plant',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'manufacturerSupplierKind',
    headerName: 'Manufacturer Kind',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'materialStandardMaterialName',
    headerName: 'Material Name',
    filter: false,
    suppressFiltersToolPanel: true,
  },
  {
    field: 'materialStandardMaterialNameHiddenFilter',
    headerName: 'Material Name Filter',
    filterParams: FILTER_PARAMS,
    hide: true,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
  },
  {
    field: 'materialStandardStandardDocument',
    headerName: 'Standard Document',
    filter: false,
    suppressFiltersToolPanel: true,
  },
  {
    field: 'materialStandardStandardDocumentHiddenFilter',
    headerName: 'Standard Document Filter',
    filterParams: FILTER_PARAMS,
    hide: true,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
  },
  {
    field: 'isPrematerial',
    headerName: 'Is Prematerial',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'materialCategory',
    headerName: 'Material Category',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'shapeName',
    headerName: 'Shape',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'shapeCode',
    headerName: 'Shape Code',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'castingMode',
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'castingDiameter',
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'minDimension',
    headerName: 'Min Dimension',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'maxDimension',
    headerName: 'Max Dimension',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'co2PerTon',
    headerName: 'kg CO₂e / t',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'ratingCode',
    headerName: 'Rating Code',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'ratingBarDiameter',
    headerName: 'Bar Diameter',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'ratingSquareDiameter',
    headerName: 'Square Diameter',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'ratingRemark',
    headerName: 'Remark',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'ratingKindName',
    headerName: 'Rating Kind',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'ratingKindCode',
    headerName: 'Rating Kind Code',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'steelMakingProcess',
    headerName: 'Steel Making Process',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'releaseDateYear',
    headerName: 'Release Date Year',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'releaseDateMonth',
    headerName: 'Release Date Month',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'releaseRestrictions',
    headerName: 'Release Restrictions',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'esr',
    headerName: 'ESR',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'var',
    headerName: 'VAR',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'export',
    headerName: 'Approved for export',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'materialNumbers',
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
    suppressColumnsToolPanel: true,
    suppressFiltersToolPanel: true,
  },
];
