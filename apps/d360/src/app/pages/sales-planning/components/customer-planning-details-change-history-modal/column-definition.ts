import { ColDef, ValueFormatterParams } from 'ag-grid-enterprise';

import { ChangeHistoryData } from '../../../../feature/sales-planning/model';
import { planningLevelMaterialTypes } from '../../../../feature/sales-planning/planning-level.service';
import { getDefaultColumn } from '../../../../shared/ag-grid/grid-defaults';
import {
  changeTypeValueFormatter,
  planningLevelValueFormatter,
  planningMonthValueFormatter,
} from '../../../../shared/ag-grid/grid-value-formatter';
import { AgGridLocalizationService } from '../../../../shared/services/ag-grid-localization.service';

const changeTypeOptions = ['U', 'I', 'D'];
const planningMonthOptions = [...Array.from({ length: 12 }).keys()].map((x) =>
  (x + 1).toString().padStart(2, '0')
);

export function changeHistoryColumnDefinitions(
  agGridLocalizationService: AgGridLocalizationService
): (ColDef & {
  title: string;
  visible: boolean;
  alwaysVisible: boolean;
})[] {
  return [
    {
      ...getDefaultColumn(),
      colId: 'planningYear',
      title: 'planningYear',
    },
    {
      ...getDefaultColumn(),
      colId: 'planningMonth',
      title: 'planningMonth',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: planningMonthOptions,
        valueFormatter: planningMonthValueFormatter(),
      },
      valueFormatter: planningMonthValueFormatter(),
    },
    {
      ...getDefaultColumn(),
      colId: 'materialTypeLevel',
      title: 'materialTypeLevel',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: planningLevelMaterialTypes,
        valueFormatter: planningLevelValueFormatter(),
      },
      valueFormatter: planningLevelValueFormatter(),
    },
    {
      ...getDefaultColumn(),
      colId: 'materialDescription',
      title: 'materialDescription',
      flex: 1,
      minWidth: 150,
      valueFormatter: (
        params: ValueFormatterParams<ChangeHistoryData, string>
      ): string =>
        params.data.materialTypeLevel
          ? `${params.data?.planningMaterial} ${params.data?.planningMaterial && params.data?.materialDescription ? '-' : ''} ${params.data?.materialDescription}`.trim()
          : '',
    },
    {
      ...getDefaultColumn(),
      colId: 'changeTimestamp',
      title: 'changeTimestamp',
      filter: 'agDateColumnFilter',
      sort: 'desc',
    },
    {
      ...getDefaultColumn(),
      colId: 'changedByUserName',
      title: 'changedByUserName',
    },
    {
      ...getDefaultColumn(),
      colId: 'changedByUserId',
      title: 'changedByUserId',
      visible: false,
    },
    {
      ...getDefaultColumn(),
      colId: 'valueOld',
      title: 'valueOld',
      filter: 'agNumberColumnFilter',
      valueFormatter: (
        params: ValueFormatterParams<ChangeHistoryData, number>
      ): string =>
        agGridLocalizationService.numberFormatter(
          params,
          0,
          params.data?.oldValueCurrency
        ),
    },
    {
      ...getDefaultColumn(),
      colId: 'valueNew',
      title: 'valueNew',
      filter: 'agNumberColumnFilter',
      valueFormatter: (
        params: ValueFormatterParams<ChangeHistoryData, number>
      ): string =>
        agGridLocalizationService.numberFormatter(
          params,
          0,
          params.data?.newValueCurrency
        ),
    },
    {
      ...getDefaultColumn(),
      colId: 'changeType',
      title: 'changeType',
      filter: 'agSetColumnFilter',
      filterParams: {
        values: changeTypeOptions,
        valueFormatter: changeTypeValueFormatter(),
      },
      valueFormatter: changeTypeValueFormatter(),
    },
  ];
}
