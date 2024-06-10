export interface SAPMaterialsRequest {
  startRow: number;
  endRow: number;
  filterModel: {
    [key: string]: {
      filterType: 'text' | 'number' | 'set' | 'date';
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
        | 'endsWith'
        | 'blank'
        | 'notBlank';
      filter: string | number;
      filterTo?: number;
      values?: string[];
      dateFrom?: string;
      dateTo?: string;
    };
  };
  sortModel: {
    colId: string;
    sort: 'asc' | 'desc';
  }[];
}
