import {
  CellClassParams,
  ColDef,
  ColGroupDef,
  IRowNode,
  ITooltipParams,
  RowNode,
} from 'ag-grid-community';

import { errorColorLight } from '../../styles/colors';
import { GridTooltipComponent } from './grid-tooltip/grid-tooltip.component';

const cellStyleInvalid = {
  backgroundColor: errorColorLight,
};

export function buildValidationProps(
  valFn: (
    value: string,
    rowData: IRowNode,
    columnId?: string
  ) => string | null | undefined,
  validateEmptyValues = false,
  defaultColor: string | null = null
): Partial<ColDef> | undefined {
  const validate = (params: ITooltipParams | CellClassParams) => {
    if (!params.node || (!params.value && !validateEmptyValues)) {
      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    }

    return valFn(
      params.value || '',
      params.node,
      getColumIdFromColumnDef(params.colDef)
    );
  };

  const defaultStyle = defaultColor
    ? { backgroundColor: defaultColor }
    : undefined;

  return {
    tooltipComponent: GridTooltipComponent,
    tooltipValueGetter: validate,
    cellStyle: (params: CellClassParams) =>
      validate(params) ? cellStyleInvalid : defaultStyle,
  };
}

export function rowIsEmpty(row: RowNode) {
  return Object.values(row.data).every((value) => !value);
}

function getColumIdFromColumnDef(
  colDef: ColDef | ColGroupDef | null | undefined
): string | undefined {
  const colIdFromColDef =
    colDef && Object.prototype.hasOwnProperty.call(colDef, 'field')
      ? (colDef as ColDef).field
      : undefined;
  const colIdFromGroup =
    colDef && Object.prototype.hasOwnProperty.call(colDef, 'groupId')
      ? (colDef as ColGroupDef).groupId
      : undefined;

  return colIdFromColDef ?? colIdFromGroup;
}
