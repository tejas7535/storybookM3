import { EChartsOption } from 'echarts';
import { format } from 'date-fns';

export const config: EChartsOption = {
  yAxis: {
    type: 'category',
    data: [0, 10, 100, '1k', '10k'],
    axisLabel: {
      color: '#646464',
      lineHeight: -25,
      verticalAlign: 'bottom',
    },
    axisLine: {
      lineStyle: {
        color: '#ced5da',
      },
    },
  },
  legend: {
    show: false,
  },
  xAxis: {
    type: 'category',
    data: [],
    splitLine: {
      show: true,
    },
    axisLabel: {
      color: '#646464',
      formatter: (d: any) => format(new Date(d), 'YYY-MM-dd'),
    },
    axisLine: {
      lineStyle: {
        color: '#ced5da',
      },
    },
  },
  gradientColor: ['#B5ECF8', '#0E656D'],
  visualMap: {
    min: 0,
    max: 100_000,
    calculable: true,
    orient: 'horizontal',
    left: 'center',
    bottom: '0%',
    show: true,
    z: 0,
  },
  series: [],
  grid: {
    top: 0,
    left: 40,
    right: 0,
  },
  tooltip: {
    position: 'top',
    formatter: (params: any) => `
      <div class="grid grid-cols-2 grid-rows-3 gap-2">
        <span>Number of Incidents:</span>
        <span>${params.data[2]}</span>
        <span>Class:</span>
        <span>${getClassificationString(params.data[1])}</span>
        <span>Time:</span> <span>${reformatLegendDate(params.data[0])}</span>

      </div>
    `,
  },
};

/**
 *
 * @param index
 * @returns
 */
export const getClassificationString = (index: number): string => {
  switch (index) {
    case 0:
      return '0 - 10';
    case 1:
      return '10 - 100';
    case 2:
      return '100 - 1000';
    case 3:
      return '1000 - 10000';
    case 4:
      return '> 10000';
    default:
      return 'n.A.';
  }
};
/**
 * @deprecated can be possible replaced by using built in date formatter of echarts
 * TODO: Refactor this
 * @param date
 * @returns a new formatted date
 */
export const reformatLegendDate = (date: string) =>
  format(new Date(date), 'MM/dd/yyyy HH:mm');
