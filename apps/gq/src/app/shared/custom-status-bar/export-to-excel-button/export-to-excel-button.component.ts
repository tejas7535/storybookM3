import { IStatusPanelParams } from '@ag-grid-community/all-modules';
import { Component } from '@angular/core';

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
    const columnKeys: string[] = [
      'materialDesignation',
      'materialNumber15',
      'productionHierarchy',
      'productionCost',
      'productionPlant',
      'plantCity',
      'plantCountry',
      'rsp',
    ];
    const today = new Date();
    const date = `${today.getFullYear()}-${
      today.getMonth() + 1
    }-${today.getDate()}`;
    const time = `${today.getHours()}-${today.getMinutes()}`;

    const excelParams = {
      columnKeys,
      allColumns: false,
      fileName: `GQ_Case_12346_${date}_${time}`, // TODO add case number
      skipHeader: false,
    };

    this.params.api.exportDataAsExcel(excelParams);
  }
}
