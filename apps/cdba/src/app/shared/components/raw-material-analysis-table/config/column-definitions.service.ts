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
        field: 'materialDesignation',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.materialDesignation'
        ),
        width: 200,
      },
      {
        field: 'materialNumber',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.materialNumber'
        ),
        width: 180,
      },
      {
        field: 'costShare',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.costShare'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(
            params,
            {
              minimumFractionDigits: 3,
            },
            'percent'
          ),
        width: 150,
      },
      {
        field: 'vendor',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.vendor'
        ),
        width: 120,
      },
      {
        field: 'operatingWeight',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.operatingWeight'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          `${this.columnUtilsService.formatNumber(params, {
            minimumFractionDigits: 3,
          })} ${params.data.unitOfWeight || ''}`,
        width: 170,
      },
      {
        field: 'price',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.pricePerKg'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(
            params,
            {
              minimumFractionDigits: 3,
              currency: params.data.currency,
            },
            'currency'
          ),
        width: 160,
      },
      {
        field: 'totalCosts',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.totalCosts'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(
            params,
            {
              minimumFractionDigits: 3,
              currency: params.data.currency,
            },
            'currency'
          ),
        width: 160,
      },
    ];

    return columnDefinitionsDefault;
  }
}
