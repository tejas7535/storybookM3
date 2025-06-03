import { Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-enterprise';

@Component({
  selector: 'd360-text-tooltip',
  imports: [],
  templateUrl: './text-tooltip.component.html',
  styleUrls: ['./text-tooltip.component.scss'],
})
export class TextTooltipComponent implements ITooltipAngularComp {
  public params!: ITooltipParams<{
    [key: string]: string;
    portfolioStatus: string;
  }>;

  public agInit(
    params: ITooltipParams<{ [key: string]: string; portfolioStatus: string }>
  ): void {
    this.params = params;
  }

  protected get tooltipMessage(): string | null {
    switch (this.params.data.portfolioStatus) {
      case 'IA': {
        return translate('material_customer.column.tooltipTextIA');
      }

      case 'SE':
      case 'SI': {
        return translate('material_customer.column.tooltipTextRE');
      }

      default: {
        return '';
      }
    }
  }
}
