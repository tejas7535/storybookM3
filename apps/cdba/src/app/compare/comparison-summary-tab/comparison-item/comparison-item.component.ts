import { Component, Input, OnInit } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { ECharts, EChartsOption } from 'echarts/types/dist/echarts';

import { ERROR_TEXT } from '@cdba/shared/constants/colors';
import { ComparisonDetail } from '@cdba/shared/models/comparison.model';

import { ComparisonDetailsChartService } from '../service/comparison-details-chart.service';
import { AXIS_LABEL_MAP } from './config/mapping-table.config';

@Component({
  selector: 'cdba-comparison-item',
  templateUrl: './comparison-item.component.html',
  standalone: false,
})
export class ComparisonItemComponent implements OnInit {
  echartsInstance: ECharts;
  eChartOptions: EChartsOption;

  @Input() firstMaterialDesignation: string;
  @Input() secondMaterialDesignation: string;
  @Input() currency: string;
  @Input() detail: ComparisonDetail;

  constructor(
    private readonly chartService: ComparisonDetailsChartService,
    private readonly transloco: TranslocoService
  ) {}

  ngOnInit(): void {
    this.eChartOptions = this.chartService.provideDetailedBarChartConfig(
      this.detail,
      this.firstMaterialDesignation,
      this.secondMaterialDesignation
    );

    this.eChartOptions = {
      ...this.eChartOptions,
      tooltip: {
        ...this.eChartOptions.tooltip,
        formatter: this.barChartTooltipFormatter,
        appendToBody: true,
      },
    };
  }

  getAxisLabelMap(): { [key: string]: string } {
    const activeLanguage = this.transloco.getActiveLang();
    const mappingTable = AXIS_LABEL_MAP.get(activeLanguage);

    if (mappingTable === undefined) {
      throw new Error(
        `Unhandled language: ${activeLanguage} passed to AxisLabelMap`
      );
    }

    return mappingTable;
  }

  barChartTooltipFormatter = (params: any): string => {
    const mappingTable = this.getAxisLabelMap();

    const difference = this.detail.costDifferences.find(
      (cost) => mappingTable[cost.type] === params[0].axisValue
    );

    if (!difference) {
      const noDataToDisplay = this.transloco.translate(
        'shared.noDataToDisplay'
      );

      return `
        <div style="display: flex; justify-content: center; align-items: center; height: 100%;">
        <span>${noDataToDisplay}</span>
        </div>
        `;
    }

    const costDiff = this.transloco.translate(
      'compare.summary.rightArea.costDiff'
    );
    const color =
      difference.costDeltaPercentage < 0 ? `color: ${ERROR_TEXT}` : '';

    return `
    <div style="display: grid; grid-template-columns: auto auto auto; gap: 5px; align-items: center">
      <div style="grid-column: span 3; font-weight: bold;">${params[0].axisValue}</div>
      <div style="background-color: ${params[0].color}; width: 14px; height: 14px;"></div>
      <div>${this.firstMaterialDesignation}</div><div style="text-align: right; font-weight: bold;">${difference.valueBom1} ${this.currency}</div>
      <div style="background-color: ${params[1].color}; width: 14px; height: 14px;"></div>
      <div>${this.secondMaterialDesignation}</div><div style="text-align: right; font-weight: bold;">${difference.valueBom2} ${this.currency}</div>
      <div style="grid-column: span 2; display: flex; justify-content: space-between">
          <div style="font-weight: bold; text-align: left">${costDiff}</div><div style="text-align: center; font-weight: bold; ${color}">${difference.costDeltaPercentage}%</div>
      </div><div style="text-align: right; font-weight: bold;">${difference.costDeltaValue} ${this.currency}</div>
    </div>
    `;
  };

  onChartInit(ec: ECharts): void {
    if (!ec) {
      throw new Error('ECharts instance is not defined');
    }

    this.echartsInstance = ec;
  }
}
