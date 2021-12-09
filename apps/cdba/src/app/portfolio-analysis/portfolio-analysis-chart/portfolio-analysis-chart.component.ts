import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';

import { EChartsOption } from 'echarts';

import { ProductCostAnalysis } from '@cdba/shared/models';

import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';

@Component({
  selector: 'cdba-portfolio-analysis-chart',
  templateUrl: './portfolio-analysis-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioAnalysisChartComponent implements OnInit {
  @Input() productCostAnalyses: ProductCostAnalysis[];

  option: EChartsOption;

  constructor(private readonly chartService: PortfolioAnalysisChartService) {}

  ngOnInit(): void {
    if (this.productCostAnalyses && this.productCostAnalyses.length > 0) {
      this.option = this.chartService.getEChartsOption(
        this.productCostAnalyses
      );
    }
  }
}
