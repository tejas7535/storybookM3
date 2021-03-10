import { Component } from '@angular/core';

import {
  IStatusPanelParams,
  ProcessCellForExportParams,
  ValueFormatterParams,
} from '@ag-grid-community/all-modules';

import { ColumnFields } from '../../services/create-column-service/column-fields.enum';

@Component({
  selector: 'gq-remove-from-offer',
  templateUrl: './export-to-excel-button.component.html',
  styleUrls: ['./export-to-excel-button.component.scss'],
})
export class ExportToExcelButtonComponent {
  private params: IStatusPanelParams;

  agInit(params: IStatusPanelParams): void {
    this.params = params;
  }

  exportToExcel(): void {
    const gridColumnApi = this.params.columnApi;
    const columnKeys = gridColumnApi
      .getAllColumns()
      .map((col) => col.getColId())
      .filter((id) => id !== '0');

    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}-${today.getMinutes()}`;

    const excelParams = {
      columnKeys,
      allColumns: false,
      fileName: `GQ_Case_${this.params.context?.gqId}_${date}_${time}`,
      skipHeader: false,
      processCellCallback: (params: ProcessCellForExportParams) => {
        const colDef = params.column.getColDef();
        if (
          colDef.valueFormatter &&
          colDef.field === ColumnFields.MATERIAL_NUMBER_15
        ) {
          const valueFormatterParams: ValueFormatterParams = {
            ...params,
            data: params.node.data,
            node: params.node,
            colDef: params.column.getColDef(),
          };

          return (colDef.valueFormatter as (
            params: ValueFormatterParams
          ) => string)(valueFormatterParams);
        }

        return params.value;
      },
    };

    this.params.api.exportDataAsExcel(excelParams);
  }
}
