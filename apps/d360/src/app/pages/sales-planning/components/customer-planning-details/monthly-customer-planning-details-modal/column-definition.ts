import { ColDef } from 'ag-grid-enterprise';

import { ColumnValueType } from '../../../../../shared/ag-grid/grid-types';
import {
  constrainedColumns,
  CustomColumnDefinition,
  getTitle,
  initiallyVisibleColumns,
  TimeScope,
  unconstrainedColumns,
  valueFormatters,
} from '../column-definition';

const monthlyInitiallyVisibleColumns: CustomColumnDefinition[] = [
  { key: 'planningMonth', type: ColumnValueType.Months },
  ...initiallyVisibleColumns,
  {
    key: 'salesDeduction',
    type: ColumnValueType.Percentage,
  },
  {
    key: 'cashDiscount',
    type: ColumnValueType.Percentage,
  },
];

export function monthlyCustomerPlanningDetailsColumnDefinitions(): (ColDef & {
  title: string;
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  return [
    ...monthlyInitiallyVisibleColumns,
    ...unconstrainedColumns,
    ...constrainedColumns,
  ].map((colDef) => ({
    ...colDef,
    sortable: false,
    colId: colDef.key,
    title: getTitle(colDef.key, colDef.isTimeScopeSpecific, TimeScope.Monthly),
    visible: monthlyInitiallyVisibleColumns.some(
      (col) => col.key === colDef.key
    ),
    alwaysVisible: false,
    valueFormatter: valueFormatters[colDef.type],
  }));
}
