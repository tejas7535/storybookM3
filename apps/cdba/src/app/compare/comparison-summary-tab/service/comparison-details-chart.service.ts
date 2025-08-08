import { Injectable } from '@angular/core';

import { TranslocoLocaleService } from '@jsverse/transloco-locale';
import { EChartsOption } from 'echarts';

import { DataPoint } from '@cdba/shared/components/bom-chart/data-point.model';
import { ComparisonType } from '@cdba/shared/constants';
import {
  CHART_HIGHLIGHT_ERROR,
  CHART_PRIMARY,
  CHART_SECONDARY,
  COST_SHARE_CATEGORY_COLORS,
} from '@cdba/shared/constants/colors';
import { ComparisonDetail } from '@cdba/shared/models/comparison.model';
import { CostShareService } from '@cdba/shared/services';

import { ComparisonChartService } from './comparison-chart.service';

@Injectable({ providedIn: 'root' })
export class ComparisonDetailsChartService {
  constructor(
    private readonly comparisonChartService: ComparisonChartService,
    private readonly localeService: TranslocoLocaleService,
    private readonly costShareService: CostShareService
  ) {}

  provideParetoChartConfig(
    details: ComparisonDetail[],
    currency: string
  ): EChartsOption {
    const xAxisData: string[] = [];
    const yAxisLineData: number[] = [];
    const yAxisBarDataPoints: DataPoint[] = [];
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    let cumulativePercentageCost = 0;

    details.forEach((detail) => {
      if (detail.costSharePercentage !== 0) {
        xAxisData.push(detail.title);
        min = Math.min(min, detail.totalCosts);
        max = Math.max(max, detail.totalCosts);

        cumulativePercentageCost += detail.costSharePercentage;
        cumulativePercentageCost = Number.parseFloat(
          cumulativePercentageCost.toPrecision(4)
        );
        yAxisLineData.push(cumulativePercentageCost);
        yAxisBarDataPoints.push({
          name: detail.title,
          value: detail.totalCosts,
          itemStyle: {
            color: COST_SHARE_CATEGORY_COLORS.get(
              this.costShareService.getCostShareCategory(
                detail.costSharePercentage / 100
              )
            ),
          },
        });
      }
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999',
          },
        },
      },
      toolbox: {
        feature: {
          saveAsImage: { show: true },
        },
      },
      xAxis: [
        {
          type: 'category',
          data: xAxisData,
          axisPointer: {
            type: 'shadow',
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
          min,
          max,
          axisLabel: {
            formatter: (value: string) => `${value} ${currency}`,
          },
        },
        {
          type: 'value',
          min: 0,
          max: 100,
          interval: 10,
          axisLabel: {
            formatter: (value: string) => `${value} %`,
          },
        },
      ],
      series: [
        {
          type: 'bar',
          tooltip: {
            valueFormatter: (value: number) =>
              `${this.localeService.localizeNumber(value, 'decimal')} ${currency}`,
          },
          data: yAxisBarDataPoints,
        },
        {
          type: 'line',
          color: CHART_HIGHLIGHT_ERROR,
          yAxisIndex: 1,
          tooltip: {
            valueFormatter: (value: string) => `${value} %`,
          },
          data: yAxisLineData,
        },
      ],
    } as EChartsOption;
  }

  provideDetailedBarChartConfig(
    detail: ComparisonDetail,
    firstMaterialDesignation: string,
    secondMaterialDesignation: string
  ): EChartsOption {
    const firstMaterialDesignationCosts: number[] = [];
    const secondMaterialDesignationCosts: number[] = [];

    detail.costDifferences.forEach((costDifference) => {
      switch (costDifference.type) {
        case ComparisonType.PURCHASE: {
          firstMaterialDesignationCosts[0] = costDifference.valueBom1;
          secondMaterialDesignationCosts[0] = costDifference.valueBom2;
          break;
        }
        case ComparisonType.RAW_MATERIAL: {
          firstMaterialDesignationCosts[1] = costDifference.valueBom1;
          secondMaterialDesignationCosts[1] = costDifference.valueBom2;
          break;
        }
        case ComparisonType.LABOUR: {
          firstMaterialDesignationCosts[2] = costDifference.valueBom1;
          secondMaterialDesignationCosts[2] = costDifference.valueBom2;
          break;
        }
        case ComparisonType.BURDEN: {
          firstMaterialDesignationCosts[3] = costDifference.valueBom1;
          secondMaterialDesignationCosts[3] = costDifference.valueBom2;
          break;
        }
        case ComparisonType.MOH: {
          firstMaterialDesignationCosts[4] = costDifference.valueBom1;
          secondMaterialDesignationCosts[4] = costDifference.valueBom2;
          break;
        }
        case ComparisonType.REMAINDER: {
          firstMaterialDesignationCosts[5] = costDifference.valueBom1;
          secondMaterialDesignationCosts[5] = costDifference.valueBom2;
          break;
        }
        case ComparisonType.TOTAL: {
          firstMaterialDesignationCosts[6] = costDifference.valueBom1;
          secondMaterialDesignationCosts[6] = costDifference.valueBom2;
          break;
        }
        default: {
          throw new Error(`Invalid Comparison Type: ${costDifference.type}`);
        }
      }
    });

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      xAxis: {
        type: 'category',
        data: [
          this.comparisonChartService.PURCHASE,
          this.comparisonChartService.RAW_MATERIAL,
          this.comparisonChartService.LABOUR,
          this.comparisonChartService.BURDEN,
          this.comparisonChartService.MOH,
          this.comparisonChartService.REMAINDER,
          this.comparisonChartService.TOTAL,
        ],
        axisLabel: {
          interval: 0,
          width: 200,
        },
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          name: firstMaterialDesignation,
          data: firstMaterialDesignationCosts,
          itemStyle: {
            color: CHART_PRIMARY,
          },
        },
        {
          type: 'bar',
          name: secondMaterialDesignation,
          data: secondMaterialDesignationCosts,
          itemStyle: {
            color: CHART_SECONDARY,
          },
        },
      ],
    } as EChartsOption;
  }
}
