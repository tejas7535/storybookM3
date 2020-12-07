import { Component } from '@angular/core';

@Component({
  selector: 'mac-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent {
  public elements = [
    {
      title: 'Hardness Converter',
      url: undefined,
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
      className: 'carbonit-icon',
      externalLink: false,
    },
    {
      title: 'Steel Cleanliness Data Base',
      url: undefined,
      className: 'steel-cleanliness-icon',
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
}
