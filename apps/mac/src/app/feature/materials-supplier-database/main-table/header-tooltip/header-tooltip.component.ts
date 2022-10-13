import { Component } from '@angular/core';

import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

@Component({
  selector: 'mac-header-tooltip',
  template: `
    <div
      class="whitespace-pre-line rounded bg-secondary-900 py-2 px-4 text-caption text-white"
      *transloco="let t; read: 'materialsSupplierDatabase.mainTable.tooltip'"
      [innerHTML]="t(params?.value)"
    ></div>
  `,
})
export class HeaderTooltipComponent implements ITooltipAngularComp {
  public params!: ITooltipParams<any, string>;

  agInit(params: ITooltipParams<any, string>): void {
    this.params = params;
  }
}
