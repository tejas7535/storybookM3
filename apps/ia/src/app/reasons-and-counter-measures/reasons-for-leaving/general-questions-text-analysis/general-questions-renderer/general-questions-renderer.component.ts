import { Component, ElementRef } from '@angular/core';

import { ECharts, EChartsOption, PieSeriesOption } from 'echarts';

import { GeneralQuestionsGridData } from '../../../models';
import { AbstractReasonAnalysisRendererComponent } from '../../shared/reason-analysis/abstract-reason-analysis-renderer.component';
import { GENERAL_QUESTIONS_CHART_CONFIG } from './';

@Component({
  selector: 'ia-general-questions-renderer',
  templateUrl: './general-questions-renderer.component.html',
  standalone: false,
  host: {
    class: 'block my-1 ml-1 mr-4',
  },
})
export class GeneralQuestionsRendererComponent extends AbstractReasonAnalysisRendererComponent<GeneralQuestionsGridData> {
  chartOptions: EChartsOption;
  mergeOptions: EChartsOption;
  echartsInstance: ECharts;
  expandedArray: number[] = [];

  constructor(public elRef: ElementRef) {
    super(elRef);
  }

  setData(data: GeneralQuestionsGridData): void {
    if (data?.chart) {
      this.chartOptions = GENERAL_QUESTIONS_CHART_CONFIG;
      this.mergeOptions = {
        series: [
          {
            ...(this.chartOptions.series as PieSeriesOption[])[0],
            data: data?.chart.data,
          },
        ],
      };
    }
    super.setData(data);
  }

  toggleExpand(index: number): void {
    if (this.expandedArray.includes(index)) {
      this.expandedArray = this.expandedArray.filter((item) => item !== index);
    } else {
      this.expandedArray.push(index);
    }

    if (this.data) {
      this.redrawRows();
    }
  }

  isExpanded(index: number) {
    return this.expandedArray.includes(index);
  }

  onChartInit(ec: ECharts): void {
    this.echartsInstance = ec;
  }
}
