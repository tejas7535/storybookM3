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
  public elements = [
    {
      title: 'Hardness Converter',
      url: '/hardness-converter',
      className: 'hardness-icon',
      externalLink: false,
    },
    {
      title: 'Lifetime Predictor',
      // url: 'https://lifetime-predictor.dp.schaeffler/',
      url: '/lifetime-predictor',
      className: 'ltp-icon',
      externalLink: false,
    },
    {
      title: 'Lifetime Visualizer',
      url: 'https://tableau.schaeffler.com/#/site/Technology/views/LifetimeVisualizer/LifetimeVisualizer',
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
      url: 'https://sconnect.schaeffler.com/community/global-technology/rd-competence-services/corporate-materials/materials-technology/materials-development/blog/2021/03/10/simulation-tool-for-carbonitriding-heat-treatment',
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

  public $breadcrumbs = this.breadcrumbsService.currentBreadcrumbs;

  public constructor(
    private readonly appInsightsService: ApplicationInsightsService,
    private readonly breadcrumbsService: BreadcrumbsService,
    private readonly applicationInsightService: ApplicationInsightsService
  ) {}

  public ngOnInit(): void {
    this.applicationInsightService.logEvent('[MAC - Overview] opened');
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
