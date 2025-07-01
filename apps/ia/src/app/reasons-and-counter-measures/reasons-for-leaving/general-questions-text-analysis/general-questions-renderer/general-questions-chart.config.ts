import { EChartsOption } from 'echarts';

import { CHART_COLOR_PALETTE } from '../../../../shared/models/color';

export const GENERAL_QUESTIONS_CHART_CONFIG: EChartsOption = {
  legend: {
    top: '30%',
    left: 0,
    orient: 'vertical',
  },
  color: [
    CHART_COLOR_PALETTE.COLORFUL_CHART_1,
    CHART_COLOR_PALETTE.COLORFUL_CHART_2,
  ],
  tooltip: {
    show: true,
    formatter: (params: any) => {
      const value = params.percent.toFixed(1);

      return `<b>${value}%</b> (${params.value} employees)`;
    },
  },
  series: [
    {
      type: 'pie',
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2,
      },
      label: {
        show: false,
      },
      labelLine: {
        show: false,
      },
    },
  ],
};
