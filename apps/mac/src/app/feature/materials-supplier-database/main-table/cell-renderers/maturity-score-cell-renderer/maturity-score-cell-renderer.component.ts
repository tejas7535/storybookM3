import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { HtmlTooltipComponent } from '@mac/shared/components/html-tooltip/html-tooltip.component';

import { MaturityInfoComponent } from '../../components/maturity-info/maturity-info.component';

@Component({
  selector: 'mac-maturity-score-cell-renderer',
  templateUrl: './maturity-score-cell-renderer.component.html',
  standalone: true,
  imports: [
    // default
    CommonModule,
    // msd
    HtmlTooltipComponent,
    MaturityInfoComponent,
    // angular material
    MatIconModule,
    // cdk
    OverlayModule,
    // libs
    SharedTranslocoModule,
  ],
})
export class MaturityScoreCellRendererComponent
  implements ICellRendererAngularComp
{
  public params: ICellRendererParams;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(): boolean {
    return false;
  }
}
