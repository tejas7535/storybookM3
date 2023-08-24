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
        field: 'operatingUnit',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.operatingUnit'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) =>
          `${this.columnUtilsService.formatNumber(params, {
            minimumFractionDigits: 3,
          })}`,
        width: 170,
      },
      {
        field: 'unitOfMeasure',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.unitOfMeasure'
        ),
        filter: 'agNumberColumnFilter',
        type: 'numericColumn',
        valueFormatter: (params) => `${params.data.unitOfMeasure || ''}`,
        width: 100,
      },
      {
        field: 'price',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.pricePerUnit'
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
        field: 'uomBaseToPriceFactor',
        headerName: translate(
          'shared.bom.additionalInformation.rawMaterialAnalysis.headers.uomBaseToPriceFactor'
        ),
        valueFormatter: (params) =>
          this.columnUtilsService.formatNumber(params, {
            maximumFractionDigits: 4,
          }),
        width: 120,
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
