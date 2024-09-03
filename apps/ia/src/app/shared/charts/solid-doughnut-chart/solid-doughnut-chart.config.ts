import { EChartsOption, SeriesOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/src/util/types';

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
        fontFamily: 'Noto Sans',
        color: 'rgba(0, 0, 0, 0.60)',
        fontStyle: 'normal',
        fontWeight: 400,
        align: 'center',
      },
    },
    textStyle: {
      fontFamily: 'Noto Sans',
    },
    legend: {
      top: 'middle',
      left: config.side === 'left' ? '0' : 'auto',
      right: config.side === 'right' ? '0' : 'auto',
      orient: 'vertical',
      itemWidth: 8,
      itemHeight: 8,
      icon: 'circle',
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

export function createSolidDoughnutChartSeries(
  side: 'left' | 'right',
  title: string
): SeriesOption[] {
  return [
    {
      type: 'pie',
      radius: ['40%', '65%'],
      center: side === 'left' ? ['70%', '50%'] : ['30%', '50%'],
      top: 0,
      avoidLabelOverlap: true,
      label: {
        position: 'inside',
        formatter: (p: CallbackDataParams) => `${p.percent.toFixed(1)}%`,
      },
      labelLine: {
        show: false,
      },
    },
    {
      type: 'pie',
      radius: ['0%', '0%'],
      center: side === 'left' ? ['70%', '50%'] : ['30%', '50%'],
      top: 0,
      avoidLabelOverlap: true,
      label: {
        position: 'center',
        formatter: title,
      },
      labelLine: {
        show: false,
      },
      legendHoverLink: false,
      data: [
        {
          value: 0,
          name: '',
          itemStyle: { color: 'transparent' },
        },
      ],
    },
  ];
}
