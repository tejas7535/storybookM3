import { Injectable } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

import { TranslocoLocaleService } from '@ngneat/transloco-locale';
import { EChartsOption } from 'echarts';

const COLOR_PLATTE = ['#5C6BC0', '#57A184', '#FFA726', '#EC407A', '#78909C'];

@Injectable()
export class PortfolioAnalysisChartService {
  eChartsOption: EChartsOption;

  constructor(
    private readonly localeService: TranslocoLocaleService,
    private readonly translocoService: TranslocoService
  ) {}

  public readonly getEChartsOption = (
    productCostAnalyses: unknown[]
  ): EChartsOption => {
    this.eChartsOption = {
      color: COLOR_PLATTE,
      textStyle: { fontFamily: 'inherit' },
      legend: {
        itemGap: 30,
      },
      grid: {
        left: '138',
        right: '75',
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const template = `
          <span class="flex text-body-2">${
            params[0].value.materialDesignation
          }</span>
          ${params
            .map((param: any) => {
              const data: any = param.data;
              const component = param.dimensionNames[param.componentIndex + 1];

              return data[component]
                ? '<span class="flex justify-between pt-1 text-body-2">' +
                    '<span>' +
                    param.marker +
                    param.seriesName +
                    ': </span>' +
                    '<span class="font-medium ml-4">' +
                    this.formatValue(data[component], param.seriesType) +
                    '</span>' +
                    '</span>'
                : '';
            })
            .join('')}
          `;

          return template;
        },
      },
      xAxis: {
        type: 'category',
        show: false,
      },
      yAxis: [
        {
          type: 'value',
          name: this.translocoService.translate(
            'portfolioAnalysis.chart.axes.costs',
            { currency: '€' }
          ),
          nameLocation: 'end',
          position: 'left',
          id: 'costs',
        },
        {
          type: 'value',
          name: this.translocoService.translate(
            'portfolioAnalysis.chart.axes.margin'
          ),
          axisLabel: {
            formatter: (val: number) => `${val * 100} %`,
          },
          nameLocation: 'end',
          position: 'right',
          id: 'margin',
        },
      ],
      dataset: {
        dimensions: [
          'id',
          'sqvMargin',
          'gpcMargin',
          'sqvCosts',
          'gpcCosts',
          'averagePrice',
        ],
        source: productCostAnalyses,
      },
      series: [
        {
          name: this.translocoService.translate(
            'portfolioAnalysis.label.sqvMargin'
          ),
          type: 'line',
          symbol: 'circle',
          yAxisId: 'margin',
          zlevel: 1,
          label: { show: false },
        },
        {
          name: this.translocoService.translate(
            'portfolioAnalysis.label.gpcMargin'
          ),
          type: 'line',
          symbol: 'circle',
          yAxisId: 'margin',
          zlevel: 1,
          label: { show: false },
        },
        {
          name: this.translocoService.translate('portfolioAnalysis.label.sqv'),
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 10,
          yAxisId: 'costs',
          zlevel: 2,
          label: { show: false },
        },
        {
          name: this.translocoService.translate('portfolioAnalysis.label.gpc'),
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 10,
          yAxisId: 'costs',
          zlevel: 2,
          label: { show: false },
        },
        {
          name: this.translocoService.translate(
            'portfolioAnalysis.label.averagePrice'
          ),
          type: 'scatter',
          symbol: 'circle',
          symbolSize: 10,
          yAxisId: 'costs',
          zlevel: 2,
          label: { show: false },
        },
      ],
    };

    return this.eChartsOption;
  };

  private readonly formatValue = (
    value: number,
    seriesType: 'line' | 'scatter'
  ): string => {
    switch (seriesType) {
      case 'line':
        return this.formatLineValue(value);
      default:
        return this.formatScatterValue(value);
    }
  };

  private readonly formatLineValue = (value: number): string => {
    return `${this.localeService.localizeNumber(
      value * 100,
      'decimal',
      undefined,
      {
        maximumFractionDigits: 2,
      }
    )}%`;
  };

  private readonly formatScatterValue = (value: number): string => {
    return `${this.localeService.localizeNumber(value, 'decimal')}`;
  };
}
