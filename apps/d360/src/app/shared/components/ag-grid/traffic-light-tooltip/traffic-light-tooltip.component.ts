import { Component, Input } from '@angular/core';

import { ITooltipParams } from 'ag-grid-community';

import { messageFromSAP } from '../../../utils/sap-localisation';
import { GridTooltipComponent } from '../grid-tooltip/grid-tooltip.component';

@Component({
  selector: 'app-traffic-light-tooltip',
  standalone: true,
  imports: [GridTooltipComponent],
  templateUrl: './traffic-light-tooltip.component.html',
  styleUrls: ['./traffic-light-tooltip.component.scss'],
})
export class TrafficLightTooltipComponent {
  @Input({ required: true }) tooltipParams!: ITooltipParams; // replace 'any' with the actual type

  get tooltipMessage(): string | null {
    const fallbackMessage = this.tooltipParams.value;
    const message = messageFromSAP(
      fallbackMessage,
      this.tooltipParams.node?.data.tlMessageNumber,
      this.tooltipParams.node?.data.tlMessageId,
      this.tooltipParams.node?.data.tlMessageV1,
      this.tooltipParams.node?.data.tlMessageV2,
      this.tooltipParams.node?.data.tlMessageV3,
      this.tooltipParams.node?.data.tlMessageV4
    );

    return !!message && message !== '' ? message : null;
  }
}
