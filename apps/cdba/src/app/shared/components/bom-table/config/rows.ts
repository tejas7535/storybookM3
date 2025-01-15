import { RowClassRules } from 'ag-grid-enterprise';

export const BOM_ROW_CLASS_RULES: RowClassRules = {
  'row-level-2': (params: any) => params.data.level === 2,
  'row-level-3': (params: any) => params.data.level === 3,
  'row-level-4': (params: any) => params.data.level === 4,
  'row-level-5': (params: any) => params.data.level === 5,
  'row-level-6': (params: any) => params.data.level === 6,
  'row-level-7': (params: any) => params.data.level === 7,
  'row-level-8': (params: any) => params.data.level === 8,
  'row-level-9': (params: any) => params.data.level === 9,
  'row-level-10': (params: any) => params.data.level === 10,
  'row-level-11': (params: any) => params.data.level === 11,
  'row-level-12': (params: any) => params.data.level === 12,
  'row-level-13': (params: any) => params.data.level === 13,
  'row-level-14': (params: any) => params.data.level === 14,
  'row-level-15': (params: any) => params.data.level === 15,
};
