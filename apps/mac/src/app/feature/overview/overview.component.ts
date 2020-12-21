import { Component } from '@angular/core';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

@Component({
  selector: 'mac-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  constructor(
    private readonly appInsightsService: ApplicationInsightsService
  ) {}

  public elements = [
    {
      title: 'Hardness Converter',
      url: '/bla',
      className: 'hardness-icon',
      externalLink: false,
    },
    {
      title: 'Lifetime Predictor',
      url: 'https://lifetime-predictor.dp.schaeffler/',
      className: 'ltp-icon',
      externalLink: true,
    },
    {
      title: 'Lifetime Visualizer',
      url:
        'https://tableau.schaeffler.com/#/site/Technology/views/LifetimeVisualizer/LifetimeVisualizer',
      className: 'ltv-icon',
      externalLink: true,
    },
    {
      title: 'Lifetime Documenter',
      url: 'https://spsq2.schaeffler.com/teamsite/5540',
      className: 'ltd-icon',
      externalLink: true,
    },
    {
      title: 'AQM Calculator',
      url: undefined,
      className: 'aqm-icon',
      externalLink: false,
    },
    {
      title: 'Carbonitriding Prediction',
      url: undefined,
      className: 'carbonitriding-icon',
      externalLink: false,
    },
    {
      title: 'Steel Cleanliness Data Base',
      url: undefined,
      className: 'steel-cleanliness-db-icon',
      externalLink: false,
    },
    {
      title: 'Polyassist',
      url: undefined,
      className: 'polyassist-icon',
      externalLink: false,
    },
  ];

  public trackByFn(index: number): number {
    return index;
  }

  public trackCall(elementName: string): void {
    // console.log('appInsight call: [MAC]  - ' + elementName)
    this.appInsightsService.logEvent('[MAC]  - ' + elementName);
  }
}
