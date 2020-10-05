import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import {
  ClientSideRowModelModule,
  ColDef,
} from '@ag-grid-community/all-modules';

import { BomItem } from '../../../../core/store/reducers/detail/models';
import { formatNumber } from '../../../../shared/table';
import { MaterialDesignationCellRendererComponent } from './material-designation-cell-renderer/material-designation-cell-renderer.component';

@Component({
  selector: 'cdba-bom-legend',
  templateUrl: './bom-legend.component.html',
  styleUrls: ['./bom-legend.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BomLegendComponent {
  @Input() data: BomItem[];

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
      valueFormatter: (params) => formatNumber(params, '1.5-5'),
    },
  ];

  public defaultColDef: ColDef = {
    sortable: true,
    resizable: true,
  };
}
