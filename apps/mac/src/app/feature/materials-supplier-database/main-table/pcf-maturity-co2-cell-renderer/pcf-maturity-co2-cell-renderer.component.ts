import { Component } from '@angular/core';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'mac-pcf-maturity-co2-cell-renderer',
  templateUrl: './pcf-maturity-co2-cell-renderer.component.html',
})
export class PcfMaturityCo2CellRendererComponent
  implements ICellRendererAngularComp
{
  public params: ICellRendererParams;
  public hovered = false;

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public refresh(): boolean {
    return false;
  }

  public hasValue(): boolean {
    return !!(this.params?.value === 0 || this.params?.value);
  }

  public getMaturity() {
    return this.params.data['maturity'];
  }
}
