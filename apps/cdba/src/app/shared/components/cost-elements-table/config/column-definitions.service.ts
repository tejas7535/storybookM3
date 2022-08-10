import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import { ColDef } from 'ag-grid-enterprise';

import { ColumnUtilsService } from '../../table';

@Injectable({
  providedIn: 'root',
})
export class ColumnDefinitionService {
  constructor(private readonly columnUtilsService: ColumnUtilsService) {}

  public getColDef(): ColDef[] {
    const columnDefinitionsDefault: ColDef[] = [
      {
        field: 'costComponent',
        headerName: translate(
          'shared.bom.additionalInformation.costElements.headers.element'
        ),
        width: 120,
      },
      {
        headerName: translate(
          'shared.bom.additionalInformation.costElements.headers.description'
        ),
        valueGetter: (params) =>
          params.data.costComponent
            ? translate(
                `shared.bom.additionalInformation.costElements.elementDescriptions.${params.data.costComponent}`
              )
            : undefined,
      },
      {
        field: 'totalValue',
        headerName: translate(
          'shared.bom.additionalInformation.costElements.headers.total'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(params, {
            minimumFractionDigits: 3,
          }),
        width: 120,
      },
      {
        field: 'fixedValue',
        headerName: translate(
          'shared.bom.additionalInformation.costElements.headers.fix'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(params, {
            minimumFractionDigits: 3,
          }),
        width: 120,
      },
      {
        field: 'variableValue',
        headerName: translate(
          'shared.bom.additionalInformation.costElements.headers.variable'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(params, {
            minimumFractionDigits: 3,
          }),
        width: 120,
      },
      {
        field: 'currency',
        headerName: translate(
          'shared.bom.additionalInformation.costElements.headers.currency'
        ),
        width: 130,
      },
    ];

    return columnDefinitionsDefault;
  }
}
