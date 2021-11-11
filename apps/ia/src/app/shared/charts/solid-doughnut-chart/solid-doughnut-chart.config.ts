import { EChartsOption, SeriesOption } from 'echarts';
import { MediaUnit } from 'echarts/types/src/util/types';

import { Color } from '../../models/color.enum';
import { SolidDoughnutChartConfig } from '../models/solid-doughnut-chart-config.model';

export function createSolidDoughnutChartBaseOptions(
  config: SolidDoughnutChartConfig
): EChartsOption {
  let option: EChartsOption = {
    type: 'pie',
    backgroundColor: Color.WHITE,
    title: {
      text: config.title,
      textStyle: {
        color: Color.BLACK,
        fontSize: '1.5rem',
        fontWeight: 'normal',
      },
      subtext: config.subTitle,
      subtextStyle: {
        color: Color.LIGHT_GREY,
        fontSize: '1rem',
      },
    },
  };
  setTooltipFormatter(option, config.tooltipFormatter);

  // set custom color if provided
  if (config.color) {
    option = { ...option, color: config.color };
  }

  return option;
}

export function setTooltipFormatter(option: EChartsOption, formatter: string) {
  if (formatter) {
    option.tooltip = {
      show: true,
      formatter,
    };
  }
}

export function createSolidDoughnutChartSeries(title: string): SeriesOption[] {
  return [
    {
      name: title,
      type: 'pie',
      label: {
        formatter: '{d}%',
        position: 'inside',
        color: Color.WHITE,
        fontSize: '0.6rem',
      },
      radius: ['65%', '95%'],
      height: '80%',
      center: ['50%', '50%'],
      top: 'middle',
    },
  ];
}

export function createMediaQueries(): MediaUnit[] {
  return [
    {
      query: {
        minWidth: 450,
        maxWidth: 750,
      },
      option: {
        height: '70%',
      },
    },
    {
      query: {
        maxWidth: 450,
      },
      option: {
        height: '80%',
      },
    },
    {
      query: {
        minWidth: 750,
      },
      option: {
        height: '80%',
      },
    },
  ];
}
