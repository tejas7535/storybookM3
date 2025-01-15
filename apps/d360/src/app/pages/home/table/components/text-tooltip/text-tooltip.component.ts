import { Component } from '@angular/core';

import { translate } from '@jsverse/transloco';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-enterprise';

@Component({
  selector: 'd360-text-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './text-tooltip.component.html',
  styleUrls: ['./text-tooltip.component.scss'],
})
export class TextTooltipComponent implements ITooltipAngularComp {
  public params!: ITooltipParams<{
    [key: string]: string;
    portfolioStatus: string;
  }>;

  agInit(
    params: ITooltipParams<{ [key: string]: string; portfolioStatus: string }>
  ): void {
    this.params = params;
  }

  get tooltipMessage(): string | null {
    if (this.params.data.portfolioStatus === 'IA') {
      return translate('material_customer.column.tooltipTextIA');
    }

    if (
      this.params.data.portfolioStatus === 'SE' ||
      this.params.data.portfolioStatus === 'SI'
    ) {
      return translate('material_customer.column.tooltipTextRE');
    }

    return '';
  }
}
