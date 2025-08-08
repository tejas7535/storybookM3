import { Injectable } from '@angular/core';

import { TranslocoService } from '@jsverse/transloco';
import { EChartsOption } from 'echarts/types/dist/echarts';

import {
  CHART_PRIMARY,
  CHART_SECONDARY,
  RADAR_CHART_REFERENCE_LINE,
} from '@cdba/shared/constants/colors';
import { ComparisonType } from '@cdba/shared/constants/comparison-type';
import {
  Comparison,
  ComparisonSummary,
  CostDifference,
} from '@cdba/shared/models/comparison.model';

import { ComparisonChartService } from './comparison-chart.service';

@Injectable({ providedIn: 'root' })
export class ComparisonSummaryChartService {
  constructor(
    private readonly transloco: TranslocoService,
    private readonly comparisonChartService: ComparisonChartService
  ) {}

  provideSummaryTableColumns(): string[] {
    return [
      'costType',
      'valueBom1',
      'valueBom2',
      'currency',
      'costDeltaValue',
      'costDeltaPercentage',
    ];
  }

  provideSummarizedRadarChartConfig(
    firstMaterialDesignation: string,
    secondMaterialDesignation: string,
    comparison: Comparison
  ): EChartsOption {
    const referenceLineTitle = this.transloco.translate(
      'compare.summary.common.referenceLine'
    );

    const purchaseCost = this.findCostDifferenceByComparisonType(
      comparison.summary,
      ComparisonType.PURCHASE
    );
    const remainderCost = this.findCostDifferenceByComparisonType(
      comparison.summary,
      ComparisonType.REMAINDER
    );
    const mohCost = this.findCostDifferenceByComparisonType(
      comparison.summary,
      ComparisonType.MOH
    );
    const burdenCost = this.findCostDifferenceByComparisonType(
      comparison.summary,
      ComparisonType.BURDEN
    );
    const labourCost = this.findCostDifferenceByComparisonType(
      comparison.summary,
      ComparisonType.LABOUR
    );
    const rawMaterialCost = this.findCostDifferenceByComparisonType(
      comparison.summary,
      ComparisonType.RAW_MATERIAL
    );

    // Calculate min max values
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    comparison.summary.costDifferences.forEach((costDifference) => {
      if (costDifference.type !== 'TOTAL') {
        min = Math.min(min, costDifference.valueBom1, costDifference.valueBom2);
        max = Math.max(max, costDifference.valueBom1, costDifference.valueBom2);
      }
    });
    min = Math.floor(min);
    max = Math.ceil(max);

    return {
      legend: {
        bottom: '0%',
        left: '5%',
        data: [
          referenceLineTitle,
          firstMaterialDesignation,
          secondMaterialDesignation,
        ],
      },
      tooltip: {
        trigger: 'item',
        valueFormatter: (value: string) => `${value} ${comparison.currency}`,
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
        },
      },
      radar: {
        indicator: [
          {
            name: this.comparisonChartService.PURCHASE,
            min,
            max,
          },
          {
            name: this.comparisonChartService.REMAINDER,
            min,
            max,
          },
          {
            name: this.comparisonChartService.MOH,
            min,
            max,
          },
          {
            name: this.comparisonChartService.BURDEN,
            min,
            max,
          },
          {
            name: this.comparisonChartService.LABOUR,
            min,
            max,
          },
          {
            name: this.comparisonChartService.RAW_MATERIAL,
            min,
            max,
          },
        ],
      },
      series: [
        {
          type: 'radar',
          data: [
            {
              name: referenceLineTitle,
              value: [0, 0, 0, 0, 0, 0],
              itemStyle: {
                color: RADAR_CHART_REFERENCE_LINE,
              },
            },
            {
              name: firstMaterialDesignation,
              value: [
                purchaseCost.valueBom1,
                remainderCost.valueBom1,
                mohCost.valueBom1,
                burdenCost.valueBom1,
                labourCost.valueBom1,
                rawMaterialCost.valueBom1,
              ],
              itemStyle: {
                color: CHART_PRIMARY,
              },
            },
            {
              name: secondMaterialDesignation,
              value: [
                purchaseCost.valueBom2,
                remainderCost.valueBom2,
                mohCost.valueBom2,
                burdenCost.valueBom2,
                labourCost.valueBom2,
                rawMaterialCost.valueBom2,
              ],
              itemStyle: {
                color: CHART_SECONDARY,
              },
            },
          ],
        },
      ],
    } as EChartsOption;
  }

  findCostDifferenceByComparisonType(
    summary: ComparisonSummary,
    type: ComparisonType
  ): CostDifference {
    return summary.costDifferences.find(
      (costDifference) => costDifference.type === type
    );
  }
}
