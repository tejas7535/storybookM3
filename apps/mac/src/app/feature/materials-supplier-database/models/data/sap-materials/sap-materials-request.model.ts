export interface SAPMaterialsRequest {
  startRow: number;
  endRow: number;
  valueCols: {
    id: string;
    displayName: string;
    field: string;
  }[];
  filterModel: {
    [key: string]: {
      filterType: 'text' | 'number';
      type:
        | 'equals'
        | 'notEqual'
        | 'lessThan'
        | 'lessThanOrEqual'
        | 'greaterThan'
        | 'greaterThanOrEqual'
        | 'inRange'
        | 'contains'
        | 'notContains'
        | 'startsWith'
        | 'endsWith';
      filter: string | number;
      filterTo?: number;
    };
  };
  sortModel: {
    colId: string;
    sort: 'asc' | 'desc';
  }[];
}
