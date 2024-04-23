import { Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ITooltipAngularComp } from 'ag-grid-angular';

import { TooltipParams } from '../table-config';

@Component({
  selector: 'mac-header-tooltip',
  template: `
    <div
      class="whitespace-pre-line rounded bg-secondary-900 py-2 px-4 text-caption text-white"
      [innerHTML]="tooltipValue"
    ></div>
  `,
})
export class HeaderTooltipComponent implements ITooltipAngularComp {
  tooltipValue: string;

  private readonly TRANSLATION_KEY_ROOT =
    'materialsSupplierDatabase.mainTable.tooltip';

  agInit(params: TooltipParams<any, string>): void {
    this.tooltipValue = params.translate
      ? translate(`${this.TRANSLATION_KEY_ROOT}.${params.value}`)
      : params.value;
  }
}
