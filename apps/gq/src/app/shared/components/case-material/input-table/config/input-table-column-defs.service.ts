import { Injectable } from '@angular/core';

import { EditCaseMaterialComponent } from '@gq/shared/ag-grid/cell-renderer/edit-cells';
import {
  FILTER_PARAMS,
  NUMBER_COLUMN_FILTER,
} from '@gq/shared/ag-grid/constants/filters';
import { Keyboard } from '@gq/shared/models';
import { translate } from '@jsverse/transloco';
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

  NEW_CASE_CREATION_COLUMN_DEFS: ColDef[] = [
    { ...this.BASE_COLUMN_DEFS[0], flex: null, width: 120 },
    { ...this.BASE_COLUMN_DEFS[1], flex: null },
    { ...this.BASE_COLUMN_DEFS[2], flex: null },
    {
      headerName: translate('shared.caseMaterial.table.customerMaterialNumber'),
      field: 'customerMaterialNumber',
      sortable: true,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          ColumnUtilityService.basicTransform(params),
      },
      valueFormatter: (params) => ColumnUtilityService.basicTransform(params),
      cellRenderer: EditCaseMaterialComponent,
    },
    { ...this.BASE_COLUMN_DEFS[3], flex: null, width: 140 },
    { ...this.BASE_COLUMN_DEFS[4], flex: null },
    {
      headerName: translate('shared.caseMaterial.table.targetPriceSource'),
      field: 'targetPriceSource',
      sortable: true,
      filterParams: {
        ...FILTER_PARAMS,
        valueFormatter: (params: ValueFormatterParams) =>
          params.value
            ? translate(
                `shared.caseMaterial.addEntry.targetPriceSource.values.${params.value}`
              )
            : ColumnUtilityService.basicTransform(params),
      },
      valueFormatter: (params: ValueFormatterParams) =>
        params.data.targetPriceSource
          ? translate(
              `shared.caseMaterial.addEntry.targetPriceSource.values.${params.data.targetPriceSource}`
            )
          : ColumnUtilityService.basicTransform({
              value: params.data.targetPriceSource,
            } as ValueFormatterParams),
      cellRenderer: EditCaseMaterialComponent,
    },
    { ...this.BASE_COLUMN_DEFS[5], flex: null, width: 120 },
    { ...this.BASE_COLUMN_DEFS[6], flex: null, width: 120 },
  ];
}
