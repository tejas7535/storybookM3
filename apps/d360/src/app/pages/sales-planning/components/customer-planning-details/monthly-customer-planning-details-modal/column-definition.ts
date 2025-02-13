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
  ].map(({ key, type, isTimeScopeSpecific }) => ({
    sortable: false,
    colId: key,
    title: getTitle(key, isTimeScopeSpecific, TimeScope.Monthly),
    visible: monthlyInitiallyVisibleColumns.some((col) => col.key === key),
    alwaysVisible: false,
    valueFormatter: valueFormatters[type],
  }));
}
