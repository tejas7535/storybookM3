import { ColDef, GridOptions } from 'ag-grid-enterprise';

import { GlobalSelectionUtils } from '../../feature/global-selection/global-selection.utils';
import { CustomerMaterialNumberCellRendererComponent } from '../components/ag-grid/cell-renderer/customer-material-number-cell-renderer/customer-material-number-cell-renderer.component';
import { getNumberFromLocale } from '../utils/number';
import { AgGridFilterType } from './grid-types';

export const defaultRowHeight = 42;

const tableDefaultProps: GridOptions = {
  stopEditingWhenCellsLoseFocus: true, // no need for manually deselecting the cell before clicking 'save'
  suppressColumnVirtualisation: true, // column virtualization prevents hidden columns to be autosized
  cellSelection: { handle: { mode: 'range' } },

  rowHeight: defaultRowHeight,
  headerHeight: 54,

  components: {
    customerMaterialNumberCellRenderer:
      CustomerMaterialNumberCellRendererComponent,
  },

  defaultColDef: {
    menuTabs: ['filterMenuTab', 'generalMenuTab'],
  },
};

export const columnSideBar = {
  id: 'columns',
  labelDefault: 'Columns',
  labelKey: 'columns',
  iconKey: 'columns',
  toolPanel: 'agColumnsToolPanel',
  toolPanelParams: {
    suppressRowGroups: true,
    suppressValues: true,
    suppressPivotMode: true,
  },
};

export const sideBar = {
  toolPanels: [
    columnSideBar,
    {
      id: 'filters',
      labelDefault: 'Filters',
      labelKey: 'filters',
      iconKey: 'filter',
      toolPanel: 'agFiltersToolPanel',
    },
  ],
};

export const serverSideTableDefaultProps: GridOptions = {
  ...tableDefaultProps,

  maxBlocksInCache: 200,
  blockLoadDebounceMillis: 50,
  rowModelType: 'serverSide',
};

export const clientSideTableDefaultProps = {
  ...tableDefaultProps,
};

export const agTextColumnFilter = [
  'equals',
  'contains',
  'startsWith',
  'endsWith',
];

export const getDefaultColDef = (
  locale: string,
  columnFilterType?: string,
  columnFilterParams?: any
): ColDef => {
  const additionalFilterOptions: Record<AgGridFilterType, string[]> = {
    [AgGridFilterType.Number]: [
      'equals',
      'greaterThan',
      'greaterThanOrEqual',
      'lessThan',
      'lessThanOrEqual',
    ],
    [AgGridFilterType.Text]: agTextColumnFilter,
    [AgGridFilterType.Date]: [
      'equals',
      'greaterThan',
      'greaterThanOrEqual',
      'lessThan',
      'lessThanOrEqual',
    ],
  };

  // The column filter type agTextColumnFilter is the default in our application.
  // If a text filter is used, no filter type is defined.
  // Therefore, we use the agTextColumnFilter as default here.
  const filterOptions =
    additionalFilterOptions[
      (columnFilterType as AgGridFilterType) ?? AgGridFilterType.Text
    ];

  return {
    filterParams: {
      numberParser: (unformatted: string) => {
        if (unformatted === null) {
          return null;
        }

        return getNumberFromLocale(unformatted, locale);
      },
      maxNumConditions: 1,
      closeOnApply: true,
      filterOptions,
      buttons: ['reset', 'apply'],
      ...columnFilterParams,
    },
    resizable: true,
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
  };
};

export function getColFilter(
  colId: string,
  filter: string | undefined,
  criteriaData: any | undefined
) {
  if (GlobalSelectionUtils.isGlobalSelectionCriteria(colId)) {
    // eslint-disable-next-line unicorn/no-useless-undefined
    return undefined;
  }

  return criteriaData?.filterableFields?.includes(colId)
    ? filter || AgGridFilterType.Text
    : undefined;
}
