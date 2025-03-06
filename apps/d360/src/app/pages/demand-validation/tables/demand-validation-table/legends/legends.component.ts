import { Component } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

@Component({
  selector: 'd360-legends',
  imports: [SharedTranslocoModule],
  templateUrl: './legends.component.html',
  styleUrl: './legends.component.scss',
})
export class LegendsComponent {
  protected items: {
    class: string;
    text: string;
  }[] = [
    {
      class: 'schaeffler-color',
      text: 'validation_of_demand.legend.current_date',
    },
    {
      class: 'error-color',
      text: 'validation_of_demand.legend.frozen_zone',
    },
    {
      class: 'warning-color',
      text: 'validation_of_demand.legend.replenishment_lead_time',
    },
  ];
}
