import { Injectable } from '@angular/core';

import { EditCaseMaterialComponent } from '@gq/shared/ag-grid/cell-renderer/edit-cells';
import {
  FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
} from '@gq/shared/ag-grid/constants/filters';
import { Keyboard } from '@gq/shared/models';
import { translate } from '@ngneat/transloco';
import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

import { ColumnUtilityService } from '../../../../ag-grid/services/column-utility.service';

@Injectable({
  providedIn: 'root',
})
export class InputTableColumnDefService {
  constructor(private readonly columnUtilityService: ColumnUtilityService) {}
  BASE_COLUMN_DEFS: ColDef[] = [
    {
      headerName: translate('shared.caseMaterial.table.info.title'),
      field: 'info',
      cellRenderer: 'infoCellComponent',
      flex: 0.15,
      sortable: true,
      filterParams: FILTER_PARAMS,
      filterValueGetter: (params) =>
        this.columnUtilityService.buildMaterialInfoText(
          params.data.info.description,
          params.data.info.errorCodes
        ),
      comparator: ColumnUtilityService.infoComparator,
    },
    {
      headerName: translate('shared.caseMaterial.table.materialDescription'),
      field: 'materialDescription',
      flex: 0.25,
      sortable: true,
      filterParams: FILTER_PARAMS,
      cellRenderer: EditCaseMaterialComponent,
    },
    {
      headerName: translate('shared.caseMaterial.table.materialNumber'),
      field: 'materialNumber',
      flex: 0.25,
      sortable: true,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          this.columnUtilityService.materialTransform(params),
      },
      cellRenderer: EditCaseMaterialComponent,
      valueFormatter: (params) =>
        this.columnUtilityService.materialTransform(params),
    },
    {
      headerName: translate('shared.caseMaterial.table.quantity'),
      field: 'quantity',
      flex: 0.15,
      sortable: true,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: ColumnUtilityService.integerFilterParams,
      cellRenderer: EditCaseMaterialComponent,
      valueFormatter: (params) =>
        this.columnUtilityService.numberFormatter(params),
    },
    {
      headerName: translate('shared.caseMaterial.table.targetPrice'),
      field: 'targetPrice',
      flex: 0.15,
      sortable: true,
      filter: NUMBER_COLUMN_FILTER,
      filterParams: this.columnUtilityService.numberFilterParams,
      cellRenderer: EditCaseMaterialComponent,
      valueFormatter: (params) =>
        this.columnUtilityService.targetPriceFormatter(params),
      headerComponentParams: {
        tooltipText: translate('shared.caseMaterial.table.targetPriceInfoText'),
        editableColumn: true,
      },
    },
    {
      headerName: translate('shared.caseMaterial.table.priceUnitOfTargetPrice'),
      field: 'priceUnit',
      flex: 0.15,
      sortable: true,
      filterParams: FILTER_PARAMS,
      valueFormatter: (params) =>
        this.columnUtilityService.numberDashFormatter(params),
    },
    {
      headerName: translate('shared.caseMaterial.table.UoM'),
      field: 'UoM',
      flex: 0.15,
      sortable: true,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          this.columnUtilityService.transformConditionUnit(params) ??
          Keyboard.DASH,
      },
      valueFormatter: (params: ValueFormatterParams) =>
        this.columnUtilityService.transformConditionUnit(params) ??
        Keyboard.DASH,
    },
  ];
}
