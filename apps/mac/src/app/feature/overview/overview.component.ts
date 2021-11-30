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
      img: '../../../assets/img/hardness_converter.svg',
    },
    {
      title: 'Materials Supplier Database',
      url: '/materials-supplier-database',
      className: 'ltv-icon',
      img: '../../../assets/img/Materials_Supplier_Database.svg',
      externalLink: false,
    },
    {
      title: 'Lifetime Predictor',
      // url: 'https://lifetime-predictor.dp.schaeffler/',
      url: '/lifetime-predictor',
      className: 'ltp-icon',
      externalLink: false,
      img: '../../../assets/img/lifetime_predictor.svg',
    },
    {
      title: 'Lifetime Documenter',
      url: 'https://spsq2.schaeffler.com/teamsite/5540',
      className: 'ltd-icon',
      externalLink: true,
      img: '../../../assets/img/lifetime_documenter.svg',
    },
    {
      title: 'AQM Calculator',
      url: '/aqm-calculator',
      className: 'aqm-icon',
      externalLink: false,
      img: '../../../assets/img/aqm_calculator.svg',
    },
    {
      title: 'Carbonitriding Prediction',
      url: 'https://sconnect.schaeffler.com/community/global-technology/rd-competence-services/corporate-materials/materials-technology/materials-development/blog/2021/03/10/simulation-tool-for-carbonitriding-heat-treatment',
      className: 'carbonitriding-icon',
      externalLink: true,
      img: '../../../assets/img/carbonitriding_prediction.svg',
    },
    {
      title: 'Steel Cleanliness Data Base',
      url: 'https://sconnect.schaeffler.com/groups/steel-cleanliness-database',
      className: 'steel-cleanliness-db-icon',
      externalLink: true,
      img: '../../../assets/img/steel_cleanliness_database.svg',
    },
    {
      title: 'Polyassist',
      url: 'https://sconnect.schaeffler.com/groups/polyassist/',
      className: 'polyassist-icon',
      externalLink: true,
      img: '../../../assets/img/polyassist.svg',
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
    changeFavicon('assets/favicons/overview.ico', 'Materials App Center');
    this.breadcrumbsService.updateBreadcrumb('');
  }

  public trackByFn(index: number): number {
    return index;
  }

  public trackCall(elementName: string): void {
    this.appInsightsService.logEvent(`[MAC] - user calls: (${elementName})`);
  }
}
