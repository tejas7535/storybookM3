import { ChangeDetectionStrategy, Component } from '@angular/core';

import { translate } from '@ngneat/transloco';

@Component({
  selector: 'ia-reasons-for-leaving-chart',
  templateUrl: './reasons-for-leaving-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReasonsForLeavingChartComponent {
  config = {
    title: '2021',
    subTitle: translate('reasonsAndCounterMeasures.topFiveReasons.title'),
  };

  data = [
    { value: 15, name: 'Others' },
    { value: 20, name: 'Team atmosphere' },
    { value: 100, name: 'Lack of training' },
    { value: 150, name: 'Volunteerprogram' },
    { value: 60, name: 'Lack of oportunity' },
    { value: 340, name: 'Lack of leadership' },
  ] as { value: number; name: string }[];
}
