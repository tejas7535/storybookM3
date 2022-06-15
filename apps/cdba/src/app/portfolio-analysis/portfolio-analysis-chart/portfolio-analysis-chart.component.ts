import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

import { ProductCostAnalysis } from '@cdba/shared/models';
import { EChartsOption } from 'echarts';

import { PortfolioAnalysisChartService } from './portfolio-analysis-chart.service';

@Component({
  selector: 'cdba-portfolio-analysis-chart',
  templateUrl: './portfolio-analysis-chart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioAnalysisChartComponent implements OnInit, OnChanges {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.productCostAnalyses) {
      this.option = this.chartService.getEChartsOption(
        this.productCostAnalyses
      );
    }
  }
}
