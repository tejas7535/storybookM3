import { EChartsOption, SeriesOption } from 'echarts';

import { Color } from '../../models/color.enum';
import { SolidDoughnutChartConfig } from '../models/solid-doughnut-chart-config.model';

export function createSolidDoughnutChartBaseOptions(
  config: SolidDoughnutChartConfig
): EChartsOption {
  const option: EChartsOption = {
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
    color: [
      Color.COLORFUL_CHART_5,
      Color.COLORFUL_CHART_4,
      Color.COLORFUL_CHART_3,
      Color.COLORFUL_CHART_2,
      Color.COLORFUL_CHART_1,
      Color.COLORFUL_CHART_0,
    ],
  };
  setTooltipFormatter(option, config.tooltipFormatter);

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
      radius: ['65%', '95%'],
      height: '80%',
      label: {
        formatter: '{d}%',
        position: 'inside',
        color: Color.WHITE,
        fontSize: '0.6rem',
      },
    },
  ];
}
