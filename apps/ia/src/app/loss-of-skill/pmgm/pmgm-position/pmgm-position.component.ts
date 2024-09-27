import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'ia-pmgm-position',
  standalone: true,
  imports: [
    SharedModule,
    MatIconModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  templateUrl: './pmgm-position.component.html',
})
export class PmgmPositionComponent implements ICellRendererAngularComp {
  isManager: boolean;

  agInit(params: ICellRendererParams): void {
    this.isManager = params.data.isManager;
  }

  refresh(): boolean {
    return false;
  }
}
