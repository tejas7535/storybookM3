import { ColDef, GridOptions } from 'ag-grid-community';

import { GlobalSelectionUtils } from '../../feature/global-selection/global-selection.utils';
import { CustomerMaterialNumberCellRendererComponent } from '../components/ag-grid/cell-renderer/customer-material-number-cell-renderer/customer-material-number-cell-renderer.component';

export const defaultRowHeight = 42;

const tableDefaultProps: GridOptions = {
  stopEditingWhenCellsLoseFocus: true, // no need for manally deselecting the cell before clicking 'save'
  suppressColumnVirtualisation: true, // column virtualization prevents hidden columns to be autosized

  suppressRowClickSelection: true, // do not select a row when selecting a cell
  suppressCopyRowsToClipboard: true, // so one can copy values from single cells while the row is selected
  rowSelection: 'multiple',
  enableRangeHandle: true,
  enableRangeSelection: true,

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
  suppressServerSideInfiniteScroll: false,
  // Setting suppressRowVirtualisation to true results in eager-loading and rendering of non-visible rows.
  // This brings a performance penalty as multiple HTTP calls are triggered and CPU resources are used to render non-visible rows.
  // In the previous React app it was set to true to render non-visible rows for tests. Once we need this, we can conditionally enable it.
  suppressRowVirtualisation: false,
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
