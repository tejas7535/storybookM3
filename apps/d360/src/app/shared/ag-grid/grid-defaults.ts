import { ColDef, GridOptions } from 'ag-grid-enterprise';

import { GlobalSelectionUtils } from '../../feature/global-selection/global-selection.utils';
import { CustomerMaterialNumberCellRendererComponent } from '../components/ag-grid/cell-renderer/customer-material-number-cell-renderer/customer-material-number-cell-renderer.component';

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

export const sideBar = {
  toolPanels: [
    {
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
    },
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

export const getDefaultColDef = (
  columnFilterType?: string,
  columnFilterParams?: any
): ColDef => {
  const additionalFilterOptions: Record<string, string[]> = {
    agNumberColumnFilter: [
      'equals',
      'greaterThan',
      'greaterThanOrEqual',
      'lessThan',
      'lessThanOrEqual',
    ],
    agTextColumnFilter: ['equals', 'contains', 'startsWith', 'endsWith'],
    agDateColumnFilter: [
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
    additionalFilterOptions[columnFilterType ?? 'agTextColumnFilter'];

  return {
    filterParams: {
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
    ? filter || 'agTextColumnFilter'
    : undefined;
}
