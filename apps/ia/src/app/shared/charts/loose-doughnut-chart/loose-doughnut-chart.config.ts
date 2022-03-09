import { EChartsOption } from 'echarts';

import { Color } from '../../models/color.enum';

export const createPieChartBaseOptions = (
  legend: string[],
  text: string,
  subtext: string
): EChartsOption => ({
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c}',
    extraCssText: 'opacity: 0',
  },
  legend: {
    data: legend,
    show: false,
  },
  title: {
    text,
    left: 'center',
    top: 'center',
    textStyle: {
      color: Color.BLACK,
      fontSize: 20,
      lineHeight: 30,
    },
    subtext,
    subtextStyle: {
      color: Color.BLACK,
      fontSize: 12,
      lineHeight: 20,
    },
  },
});

export const createPieChartSeries = (
  radius: string[],
  value: number,
  totalValue: number,
  color: string,
  seriesName: string,
  dataName: string
) => {
  const counterValue = totalValue ? totalValue - value : 100;
  const formatter = `<table>
    <tr>
      <td class="pr-4"><b>{c}</b></td>
      <td>Employees</td>
    </tr>
  </table>`;

  return {
    name: seriesName,
    type: 'pie',
    radius,
    label: {
      show: false,
    },
    emphasis: {
      scale: false,
    },
    data: [
      {
        value,
        name: dataName,
        tooltip: {
          trigger: 'item',
          formatter,
          extraCssText: 'opacity: 1',
        },
        itemStyle: {
          color,
          borderRadius: ['20%', '50%'],
        },
      },
      {
        value: counterValue,
        name: 'invis',
        itemStyle: {
          color: Color.GREY,
        },
        emphasis: {
          itemStyle: {
            color: Color.GREY,
          },
        },
      },
    ],
  };
};
