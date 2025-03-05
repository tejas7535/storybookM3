import { ColDef } from 'ag-grid-community';

import {
  CASTING_DIAMETER,
  CASTING_MODE,
  CO2_CLASSIFICATION,
  CO2_CLASSIFICATION_NEW,
  CO2_COMMENT,
  CO2_PER_TON,
  CO2_STANDARD,
  CO2_UPLOAD_FILE,
  MANUFACTURER,
  MANUFACTURER_SUPPLIER_NAME,
  MANUFACTURER_SUPPLIER_PLANT,
  MANUFACTURER_SUPPLIER_SELFCERTIFIED,
  MATERIAL_NUMBERS,
  MATERIAL_STANDARD_MATERIAL_NAME,
  MATERIAL_STANDARD_STANDARD_DOCUMENT,
  MATERIAL_STANDARD_STOFF_ID,
  MAX_DIMENSION,
  MIN_DIMENSION,
  PRODUCT_CATEGORY,
  PRODUCT_CATEGORY_RULE,
  RATING,
  RATING_REMARK,
  RECENT_STATUS,
  RECYCLING_RATE,
  REFERENCE_DOCUMENT,
  RELEASE_DATE,
  RELEASE_RESTRICTIONS,
  RELEASED_STATUS,
  STEEL_MAKING_PROCESS,
} from '@mac/msd/constants';
import { FILTER_PARAMS } from '@mac/msd/main-table/table-config/filter-params';
import {
  MANUFACTURER_VALUE_GETTER,
  MATERIALSTANDARD_LINK_FORMATTER,
  MATERIALSTOFFID_LINK_FORMATTER,
  RECYCLING_RATE_FILTER_VALUE_GETTER,
  RECYCLING_RATE_VALUE_GETTER,
  RELEASE_DATE_FORMATTER,
  RELEASE_DATE_VALUE_GETTER,
  replaceColumn,
  SELF_CERTIFIED_VALUE_GETTER,
  STATUS_VALUE_GETTER,
  TRANSLATE_VALUE_FORMATTER_FACTORY,
} from '@mac/msd/main-table/table-config/helpers';
import { BASE_COLUMN_DEFINITIONS } from '@mac/msd/main-table/table-config/materials/base';

import { Co2UploadFileCellRendererComponent } from '../../../cell-renderers/co2-upload-file-cell-renderer/co2-upload-file-cell-renderer.component';
import { EditCellRendererComponent } from '../../../cell-renderers/edit-cell-renderer/edit-cell-renderer.component';
import { GreenSteelCellRendererComponent } from '../../../cell-renderers/green-steel-cell-renderer/green-steel-cell-renderer.component';
import { LinkCellRendererComponent } from '../../../cell-renderers/link-cell-renderer/link-cell-renderer.component';
import { ReleaseStatusCellRendererComponent } from '../../../cell-renderers/release-status-cell-renderer/release-status-cell-renderer.component';
import { excludeColumn, lockColumns } from '../../helpers';

export const STEEL_COLUMN_DEFINITIONS: ColDef[] = [
  ...lockColumns(
    [
      PRODUCT_CATEGORY,
      MATERIAL_STANDARD_MATERIAL_NAME,
      MATERIAL_STANDARD_STANDARD_DOCUMENT,
      MANUFACTURER_SUPPLIER_NAME,
      MANUFACTURER_SUPPLIER_PLANT,
      RELEASE_RESTRICTIONS,
    ],
    // 'recentStatus' is replaced by 'releasedStatus'
    excludeColumn(
      [RECENT_STATUS, CO2_CLASSIFICATION],
      // CO2, materstandard get replaced so they keep their position!
      replaceColumn(
        [
          {
            field: MATERIAL_STANDARD_STANDARD_DOCUMENT,
            headerName: MATERIAL_STANDARD_STANDARD_DOCUMENT,
            filterParams: FILTER_PARAMS,
            tooltipValueGetter: (params) =>
              params.value ? 'standardLink' : undefined,
            valueFormatter: MATERIALSTANDARD_LINK_FORMATTER,
            cellRenderer: LinkCellRendererComponent,
            useValueFormatterForExport: false,
          },
          {
            field: CO2_PER_TON,
            headerName: CO2_PER_TON,
            filter: 'agNumberColumnFilter',
            headerTooltip: CO2_PER_TON,
            width: 140,
            cellRenderer: GreenSteelCellRendererComponent,
          },
        ],
        BASE_COLUMN_DEFINITIONS
      )
    )
  ),
  {
    field: RELEASED_STATUS,
    headerName: RELEASED_STATUS,
    filterParams: FILTER_PARAMS,
    cellRenderer: ReleaseStatusCellRendererComponent,
    valueGetter: STATUS_VALUE_GETTER,
    cellClass: ['!pl-0', '!pr-2'],
    headerClass: ['!-ml-12', '!w-[123px]'],
    width: 75,
    pinned: 'left',
    lockPinned: true,
    lockVisible: true,
    lockPosition: true,
    resizable: false,
    suppressMovable: true,
    hide: false,
    suppressHeaderMenuButton: true,
  },
  {
    field: MATERIAL_NUMBERS,
    headerName: 'steelNumber',
    headerTooltip: 'steelNumber',
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MANUFACTURER,
    headerName: MANUFACTURER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueGetter: MANUFACTURER_VALUE_GETTER,
  },
  {
    field: MIN_DIMENSION,
    headerName: MIN_DIMENSION,
    filter: 'agNumberColumnFilter',
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: MAX_DIMENSION,
    headerName: MAX_DIMENSION,
    hide: false,
    lockVisible: true,
    filter: 'agNumberColumnFilter',
    headerTooltip: MAX_DIMENSION,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING,
    headerName: RATING,
    filterParams: FILTER_PARAMS,
    headerTooltip: RATING,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RATING_REMARK,
    headerName: RATING_REMARK,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CASTING_MODE,
    headerName: CASTING_MODE,
    filterParams: FILTER_PARAMS,
    hide: false,
    lockVisible: true,
    headerTooltip: CASTING_MODE,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.mainTable.dialog',
      true
    ),
  },
  {
    field: CASTING_DIAMETER,
    headerName: CASTING_DIAMETER,
    filterParams: FILTER_PARAMS,
    hide: false,
    lockVisible: true,
    headerTooltip: CASTING_DIAMETER,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: STEEL_MAKING_PROCESS,
    headerName: STEEL_MAKING_PROCESS,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: STEEL_MAKING_PROCESS,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RECYCLING_RATE,
    headerName: RECYCLING_RATE,
    filter: 'agNumberColumnFilter',
    filterValueGetter: RECYCLING_RATE_FILTER_VALUE_GETTER,
    valueGetter: RECYCLING_RATE_VALUE_GETTER,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: RELEASE_DATE,
    headerName: RELEASE_DATE,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: RELEASE_DATE_FORMATTER,
    valueGetter: RELEASE_DATE_VALUE_GETTER,
    headerTooltip: RELEASE_DATE,
    filter: 'agDateColumnFilter',
  },
  {
    field: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    headerName: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    hide: true,
    headerTooltip: MANUFACTURER_SUPPLIER_SELFCERTIFIED,
    cellRenderer: EditCellRendererComponent,
    valueGetter: SELF_CERTIFIED_VALUE_GETTER,
  },
  {
    field: MATERIAL_STANDARD_STOFF_ID,
    headerName: MATERIAL_STANDARD_STOFF_ID,
    filterParams: FILTER_PARAMS,
    hide: true,
    headerTooltip: MATERIAL_STANDARD_STOFF_ID,
    tooltipValueGetter: (params) => (params.value ? 'wiamLink' : undefined),
    valueFormatter: MATERIALSTOFFID_LINK_FORMATTER,
    cellRenderer: LinkCellRendererComponent,
  },
  {
    field: REFERENCE_DOCUMENT,
    headerName: REFERENCE_DOCUMENT,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_CLASSIFICATION_NEW,
    headerName: CO2_CLASSIFICATION_NEW,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
    valueFormatter: TRANSLATE_VALUE_FORMATTER_FACTORY(
      'materialsSupplierDatabase.mainTable.dialog.co2ClassificationNew',
      false
    ),
  },
  {
    field: CO2_STANDARD,
    headerName: CO2_STANDARD,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_COMMENT,
    headerName: CO2_COMMENT,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: PRODUCT_CATEGORY_RULE,
    headerName: PRODUCT_CATEGORY_RULE,
    filterParams: FILTER_PARAMS,
    hide: true,
    cellRenderer: EditCellRendererComponent,
  },
  {
    field: CO2_UPLOAD_FILE,
    headerName: CO2_UPLOAD_FILE,
    filter: 'agNumberColumnFilter',
    filterParams: {
      filterOptions: ['equals', 'blank', 'notBlank'],
      buttons: ['reset'],
      maxNumConditions: 1,
    },
    hide: true,
    cellRenderer: Co2UploadFileCellRendererComponent,
  },
];
