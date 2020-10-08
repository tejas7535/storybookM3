import { ColDef } from '@ag-grid-community/all-modules';

export const COLUMN_DEFINITIONS: ColDef[] = [
  {
    field: 'sectorKey',
    headerName: 'Branch',
  },
  {
    field: 'sectorName',
    headerName: 'Text',
  },
  {
    field: 'keyAccountName',
    headerName: 'Key Account',
  },
  {
    headerName: 'Name',
  },
  {
    field: 'socoCustomerNumberGlobalName',
    headerName: 'Customer',
  },
  {
    headerName: 'Name 1',
  },
  {
    field: 'productLineKey',
    headerName: 'Part Number',
  },
  {
    field: 'socoArticleNumberGlobalName',
    headerName: 'Short Text',
  },
  {
    field: 'productionPlantKey',
    headerName: 'Production Plant',
  },
  {
    field: 'category',
    headerName: 'Category',
  },
  {
    field: 'lastModifier',
    headerName: 'Last SOCO Planner',
  },
  {
    field: 'eopDateVerified',
    headerName: 'EOP',
    filter: 'agDateColumnFilter',
  },
  {
    field: 'edoDate',
    headerName: 'EDO',
    filter: 'agDateColumnFilter',
  },
  {
    headerName: 'Status',
  },
  {
    field: 'lastUpdated',
    headerName: 'Last Modified',
  },
];
