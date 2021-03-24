import { Component, OnInit } from '@angular/core';

import { ApplicationInsightsService } from '@schaeffler/application-insights';
import { changeFavicon } from '../../shared/change-favicon';
import { BreadcrumbsService } from '../../shared/services/breadcrumbs/breadcrumbs.service';

@Component({
  selector: 'mac-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
})
export class OverviewComponent implements OnInit {
  constructor(
    private readonly appInsightsService: ApplicationInsightsService,
    private readonly breadcrumbsService: BreadcrumbsService
  ) {}

  $breadcrumbs = this.breadcrumbsService.currentBreadcrumbs;

  public elements = [
    {
      title: 'Hardness Converter',
      url: '/hardness-converter',
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
      url: '/aqm-calculator',
      className: 'aqm-icon',
      externalLink: false,
    },
    {
      title: 'Carbonitriding Prediction',
      url:
        'http://ws000704:9988/webapps/home/session.html?app=Carbonitriding_prediction',
      className: 'carbonitriding-icon',
      externalLink: true,
    },
    {
      title: 'Steel Cleanliness Data Base',
      url: 'https://sconnect.schaeffler.com/groups/steel-cleanliness-database',
      className: 'steel-cleanliness-db-icon',
      externalLink: true,
    },
    {
      title: 'Polyassist',
      url: 'https://sconnect.schaeffler.com/groups/polyassist/',
      className: 'polyassist-icon',
      externalLink: true,
    },
  ];

  ngOnInit(): void {
    changeFavicon('assets/favicons/overview.ico');
    this.breadcrumbsService.updateBreadcrumb('');
  }

  public trackByFn(index: number): number {
    return index;
  }

  public trackCall(elementName: string): void {
    this.appInsightsService.logEvent(`[MAC] - user calls: (${elementName})`);
  }
}
