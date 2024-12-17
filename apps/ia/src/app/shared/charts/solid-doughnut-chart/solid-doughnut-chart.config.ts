import { EChartsOption, PieSeriesOption } from 'echarts';
import { CallbackDataParams } from 'echarts/types/dist/shared';
import {
  OptionDataItem,
  SeriesLabelOption,
} from 'echarts/types/src/util/types';

import { Color } from '../../models/color';
import { SolidDoughnutChartConfig } from '../models/solid-doughnut-chart-config.model';

export function createSolidDoughnutChartBaseOptions(
  config: SolidDoughnutChartConfig
): EChartsOption {
  let option: EChartsOption = {
    backgroundColor: Color.WHITE,
    title: {
      text: config.title,
      textStyle: {
        fontFamily: 'Noto Sans',
        color: Color.TEXT_MEDIUM_EMPHASIS,
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
      formatter: (name: string) => {
        // Break the label into multiple lines if it is too long
        const maxLineLength = 32; // Adjust as needed
        const words = name.split(' ');
        let formattedName = '';
        let line = '';

        words.forEach((word) => {
          if ((line + word).length > maxLineLength) {
            formattedName += `${line}\n`;
            line = '';
          }
          line += `${word} `;
        });

        formattedName += line.trim();

        return formattedName;
      },
    },
    tooltip: {
      show: true,
    },
  };

  // set custom color if provided
  if (config.color) {
    option = { ...option, color: config.color };
  }

  return option;
}

export const tooltipFormatter = (params: CallbackDataParams) =>
  params.percent === undefined
    ? undefined
    : `${params.name}: <b>${params.percent.toFixed(1)}%</b>`;

export function createSolidDoughnutChartSeries(
  side: 'left' | 'right',
  title: SeriesLabelOption,
  titleTooltip: string
): PieSeriesOption[] {
  return [
    {
      id: 'reasons',
      type: 'pie',
      radius: ['38%', '56%'],
      center: side === 'left' ? ['70%', '50%'] : ['30%', '50%'],
      top: 0,
      avoidLabelOverlap: true,
      selectedMode: 'single',
      label: {
        position: 'inside',
        formatter: (p: CallbackDataParams) =>
          `${(p.data as OptionDataItem & { percent: number }).percent.toFixed(1)}%`,
      },
      labelLine: {
        show: false,
      },
      tooltip: {
        show: true,
        formatter: tooltipFormatter,
      },
    },
    {
      id: 'detailedReasons',
      type: 'pie',
      radius: ['60%', '80%'],
      center: side === 'left' ? ['70%', '50%'] : ['30%', '50%'],
      top: 0,
      avoidLabelOverlap: true,
      labelLine: {
        show: false,
      },
      label: {
        position: 'inside',
        rotate: 0,
        precision: 1,
        formatter: (p: CallbackDataParams) =>
          (p.data as { percent: number }).percent
            ? `${(p.data as OptionDataItem & { percent: number }).percent.toFixed(1)}%`
            : undefined,
      },

      data: [{ value: 0, name: '', itemStyle: { color: 'transparent' } }],
      tooltip: {
        formatter: tooltipFormatter,
      },
    },
    {
      id: 'title',
      type: 'pie',
      radius: ['0%', '0%'],
      center: side === 'left' ? ['70%', '50%'] : ['30%', '50%'],
      top: 0,
      avoidLabelOverlap: true,
      label: { ...title, position: 'center' },
      emphasis: { disabled: true },
      labelLine: {
        show: false,
      },
      data: [
        {
          value: 0,
          name: '',
          itemStyle: { color: 'transparent' },
        },
      ],
      tooltip: {
        show: true,
        formatter: titleTooltip,
      },
    },
  ];
}
