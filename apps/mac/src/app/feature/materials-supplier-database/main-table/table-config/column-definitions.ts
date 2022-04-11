import { ColDef } from '@ag-grid-enterprise/all-modules';

import { BOOLEAN_VALUE_GETTER } from './boolean-value-getter';
import { FILTER_PARAMS } from './filter-params';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'materialStandardMaterialName',
    headerName: 'Material Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'materialStandardStandardDocument',
    headerName: 'Standard Document',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'materialNumbers',
    headerName: 'Material Numbers',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'manufacturerSupplierName',
    headerName: 'Supplier Name',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'manufacturerSupplierPlant',
    headerName: 'Supplier Plant',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'sapSupplierIds',
    headerName: 'SAP Supplier ID(s)',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'manufacturerSupplierKind',
    headerName: 'Kind',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'minDimension',
    headerName: 'Min Dimension',
    filter: 'agNumberColumnFilter',
    hide: true,
  },
  {
    field: 'maxDimension',
    headerName: 'Max Dimension',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'ratingKindName',
    headerName: 'Supplier Rating',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'co2PerTon',
    headerName: 'kg CO₂e / t',
    filter: 'agNumberColumnFilter',
  },
  {
    field: 'isPrematerial',
    headerName: 'Is Prematerial',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
  {
    field: 'shapeName',
    headerName: 'Product Category',
    filterParams: FILTER_PARAMS,
  },
  {
    field: 'shapeCode',
    headerName: 'Product Category Code',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'castingMode',
    headerName: 'Casting Mode',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'castingDiameter',
    headerName: 'Casting Diameter',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'steelMakingProcess',
    headerName: 'Steel Making Process',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'releaseDateYear',
    headerName: 'Release Date Year',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'releaseDateMonth',
    headerName: 'Release Date Month',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'releaseRestrictions',
    headerName: 'Release Restrictions',
    filterParams: FILTER_PARAMS,
    hide: true,
  },
  {
    field: 'esr',
    headerName: 'ESR',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
  {
    field: 'var',
    headerName: 'VAR',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
  {
    field: 'export',
    headerName: 'Approved for export',
    filterParams: FILTER_PARAMS,
    filterValueGetter: BOOLEAN_VALUE_GETTER,
    hide: true,
  },
];
