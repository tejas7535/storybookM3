import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedModule } from '../../../shared/shared.module';
import { PmgmArrow } from '../../models';

@Component({
  selector: 'ia-pmgm-arrow',
  imports: [SharedModule, MatIconModule],
  templateUrl: './pmgm-arrow.component.html',
  styles: [
    `
      :host {
        @apply flex h-full;
      }
    `,
  ],
})
export class PmgmArrowComponent implements ICellRendererAngularComp {
  pmgmArrowEnum = PmgmArrow;
  arrow: PmgmArrow;

  agInit(params: ICellRendererParams): void {
    this.arrow = params.value;
  }

  refresh(): boolean {
    return false;
  }
}
