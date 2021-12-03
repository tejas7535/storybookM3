import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-enterprise/all-modules';

import { ColumnUtilsService } from '@cdba/shared/components/table';
import { BomItem } from '@cdba/shared/models';

import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

@Component({
  selector: 'cdba-bom-legend',
  templateUrl: './bom-legend.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomLegendComponent {
  @Input() data: BomItem[];

  constructor(private readonly columnUtilsService: ColumnUtilsService) {}

  public modules = [ClientSideRowModelModule];
  public columnDefs: ColDef[] = [
    {
      field: 'materialDesignation',
      flex: 2,
      cellRendererFramework: MaterialDesignationCellRendererComponent,
      cellRendererParams: {
        color: 'red',
      },
    },
    {
      field: 'totalPricePerPc',
      headerName: 'Cost (EUR)',
      flex: 1,
      valueFormatter: (params) =>
        this.columnUtilsService.formatNumber(params, {
          minimumFractionDigits: 5,
          maximumFractionDigits: 5,
        }),
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };
}
