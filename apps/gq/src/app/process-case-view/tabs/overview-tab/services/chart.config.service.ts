import { Injectable } from '@angular/core';

import { translate } from '@jsverse/transloco';
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
    '#619685',
    '#AFC2C7',
    '#C9DEA5',
    '#67898F',
    '#20617C',
    '#94BF99',
    '#237864',
    '#8DA8BC',
    '#8CBFD3',
    '#476E75',
    '#73B281',
    '#00445F',
    '#1C98B5',
    '#95B7AB',
    '#D6C7A4',
    '#B86300',
    '#A1C861',
    '#522C00',
    '#F7D52A',
    '#C4A200',
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
    <div class="flex w-[250px] flex-col p-2">
    <span class="text-body-medium font-semibold text-on-surface">${data.name}</span>

    <div class="flex flex-row justify-between">
    <div class="flex flex-row items-center">
    <span
    style ="${this.tooltipLegendStyle} background-color: ${param.color};"
    ></span>
      <span class="text-body-medium text-on-surface-variant">${translate(
        `processCaseView.tabs.overview.quotationByProductionLineOrGPSD.tooltip.numberOfItemsLabel`
      )}</span>
      </div>
      <span class="text-body-medium text-on-surface">${data.numberOfItems}</span>
    </div>

    <div class="flex flex-row justify-between">
      <div class="flex flex-row items-center">
      <span style ="${this.tooltipLegendStyle} background-color: ${
        param.color
      };"></span>
        <span class="text text-body-medium text-on-surface-variant"> ${translate(
          `processCaseView.tabs.overview.quotationByProductionLineOrGPSD.tooltip.shareLabel`
        )}</span>
      </div>
      <span class="text-body-medium text-on-surface">${data.share}</span>
    </div>

    <div class="flex flex-row justify-between">
    <div class="flex flex-row items-center">
    <span
    style ="${this.tooltipLegendStyle} background-color: ${param.color};"
    ></span>
      <span class="text-body-medium text-on-surface-variant">${translate(
        `processCaseView.tabs.overview.quotationByProductionLineOrGPSD.tooltip.gpmLabel`
      )}</span>
      </div>
      <span class="text-body-medium text-on-surface">${data.gpm}</span>
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
    const item = `${param}  ${data ? data[0].share : ''}`;

    return item;
  };
}
