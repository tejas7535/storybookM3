import { EChartsOption, SeriesOption } from 'echarts';

import { Color } from '../../models/color.enum';

export function createSolidDoughnutChartBaseOptions(config: {
  title: string;
  subTitle: string;
}): EChartsOption {
  return {
    type: 'pie',
    backgroundColor: Color.WHITE,
    title: {
      text: config.title,
      textStyle: {
        color: Color.BLACK,
        fontSize: 20,
        fontWeight: 'normal',
      },
      subtext: config.subTitle,
      subtextStyle: {
        color: Color.LIGHT_GREY,
        fontSize: 14,
      },
      left: 'center',
      top: 'center',
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
}

export function createSolidDoughnutChartSeries(title: string): SeriesOption[] {
  return [
    {
      name: title,
      type: 'pie',
      radius: ['55%', '80%'],
      label: {
        formatter: '{d}%',
        position: 'inside',
        color: Color.WHITE,
        fontSize: 10,
      },
    },
  ];
}
