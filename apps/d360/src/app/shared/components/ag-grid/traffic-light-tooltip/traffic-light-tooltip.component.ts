import { Component } from '@angular/core';

import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';

import { messageFromSAP } from '../../../utils/sap-localisation';

@Component({
  selector: 'app-traffic-light-tooltip',
  standalone: true,
  imports: [],
  templateUrl: './traffic-light-tooltip.component.html',
  styleUrls: ['./traffic-light-tooltip.component.scss'],
})
export class TrafficLightTooltipComponent implements ITooltipAngularComp {
  public params!: ITooltipParams<{
    value: string;
    tlMessageNumber: number | null;
    tlMessageId: string | null;
    tlMessageV1: string | null;
    tlMessageV2: string | null;
    tlMessageV3: string | null;
    tlMessageV4: string | null;
  }>;

  agInit(params: ITooltipParams): void {
    this.params = params;
  }

  get tooltipMessage(): string | null {
    const fallbackMessage = this.params.value;
    const message = messageFromSAP(
      fallbackMessage,
      this.params.node?.data.tlMessageNumber,
      this.params.node?.data.tlMessageId,
      this.params.node?.data.tlMessageV1,
      this.params.node?.data.tlMessageV2,
      this.params.node?.data.tlMessageV3,
      this.params.node?.data.tlMessageV4
    );

    return !!message && message !== '' ? message : null;
  }
}
