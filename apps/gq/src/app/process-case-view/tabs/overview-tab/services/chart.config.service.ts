import { Injectable } from '@angular/core';

import { translate } from '@ngneat/transloco';
import {
  LegendComponentOption,
  SeriesOption,
  TooltipComponentOption,
  XAXisComponentOption,
} from 'echarts';

import { BarChartData } from '../models/bar-chart-data.model';

@Injectable({
  providedIn: 'root',
})
export class ChartConfigService {
  COLORS: string[] = [
    '#E7EFE6',
    '#B2CFB3',
    '#73B281',
    '#E2EDD0',
    '#C4DB9B',
    '#A1C861',
    '#005E46',
    '#4E8C7A',
    '#A7C3B9',
    '#D0D0D0',
    '#9D9D9D',
    '#646464',
    '#A0B6C8',
    '#477791',
    '#00445F',
    '#A1CADB',
    '#1C98B5',
    '#BDCDD1',
    '#7F9CA3',
    '#476E75',
  ];

  LEGEND: LegendComponentOption = {
    align: 'left',
    orient: 'horizontal',
    itemGap: 20,
    borderRadius: 10,
    left: '4rem',
    bottom: '0rem',
    formatter: (param: any) => this.getLegendFormatter(param),
  };

  X_AXIS_CONFIG: XAXisComponentOption = {
    type: 'value',
    show: false,
  };

  TOOLTIP_CONFIG: TooltipComponentOption = {
    trigger: 'item',
    axisPointer: {
      type: 'line',
    },
  };

  public tooltipLegendStyle = `display: inline-block; margin-right: 4px; width: 10px; height: 10px;`;
  public seriesConfig: SeriesOption[] = [];

  getLegendConfig = (): LegendComponentOption => ({
    ...this.LEGEND,
    formatter: (param: any) => this.getLegendFormatter(param),
  });

  getTooltipConfig = (): TooltipComponentOption => ({
    ...this.TOOLTIP_CONFIG,
    formatter: (param: any) => this.getTooltipFormatter(param),
  });

  getSeriesConfig = (data: BarChartData[]): SeriesOption[] => {
    this.seriesConfig = [];
    data.forEach((item: BarChartData, i: number, array: BarChartData[]) => {
      const configItem: SeriesOption = {
        type: 'bar',
        stack: 'total',
        name: `${item.name}`,
        data: [item],
      };

      if (i === 0) {
        configItem.itemStyle = {
          borderRadius: [10, 0, 0, 10],
        };
      }

      if (i === array.length - 1) {
        configItem.itemStyle = {
          borderRadius: [0, 10, 10, 0],
        };
      }

      if (i === 0 && i === array.length - 1) {
        configItem.itemStyle = {
          borderRadius: 10,
        };
      }

      this.seriesConfig.push(configItem);
    });

    return this.seriesConfig;
  };

  getLegend = (series: SeriesOption[]): LegendComponentOption => {
    const data: any = [];
    series.forEach((item: SeriesOption) => {
      data.push({ name: `${item.name}`, icon: 'square' });
    });

    return {
      ...this.LEGEND,
      data,
    };
  };

  getXAxisConfig = (data: BarChartData[]): XAXisComponentOption => {
    const max = data
      .filter((item: BarChartData) => !!item)
      .map((item: BarChartData) => item.value)
      .reduce((sum: number, x: number) => sum + x, 0);

    return { ...this.X_AXIS_CONFIG, max };
  };

  getTooltipFormatter = (param: any): string => {
    const data: BarChartData = param.data;
    const item = `
    <div class="flex w-[200px] flex-col p-2">
    <span class="text-body-2 font-semibold text-high-emphasis">${
      data.name
    }</span>
    <div class="flex flex-row justify-between">
      <div class="flex flex-row items-center">
      <span style ="${this.tooltipLegendStyle} background-color: ${
      param.color
    };"></span>
        <span class="text text-body-2 text-medium-emphasis"> ${translate(
          `processCaseView.tabs.overview.quotationByProductionLineOrGPSD.tooltip.shareLabel`
        )}</span>
      </div>
      <span class="text-body-2 text-high-emphasis">${data.share}</span>
    </div>
    
    <div class="flex flex-row justify-between">
    <div class="flex flex-row items-center">
    <span
    style ="${this.tooltipLegendStyle} background-color: ${param.color};"
    ></span>
      <span class="text-body-2 text-medium-emphasis">${translate(
        `processCaseView.tabs.overview.quotationByProductionLineOrGPSD.tooltip.gpmLabel`
      )}</span>
      </div>
      <span class="text-body-2 text-high-emphasis">${data.gpm}</span>
    </div>
  </div>`;

    return item;
  };

  getLegendFormatter = (param: any): string => {
    const seriesFound = this.seriesConfig.findIndex(
      (item: SeriesOption) => !!item && item.name === param
    );
    const data: BarChartData[] =
      seriesFound > -1
        ? (this.seriesConfig[seriesFound].data as BarChartData[])
        : undefined;
    const item = `${param} ${data ? data[0].share : ''}`;

    return item;
  };
}
