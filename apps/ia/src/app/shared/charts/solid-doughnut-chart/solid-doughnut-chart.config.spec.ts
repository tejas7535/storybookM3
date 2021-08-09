import { Color } from '../../models/color.enum';
import {
  createSolidDoughnutChartBaseOptions,
  createSolidDoughnutChartSeries,
} from './solid-doughnut-chart.config';

describe('solid-doughnut-chart config', () => {
  test('should create base options', () => {
    const config = { title: 'Top 5 reasons', subTitle: '2021' };
    const expectedResult = {
      type: 'pie',
      backgroundColor: Color.WHITE,
      title: {
        text: config.title,
        textStyle: {
          color: Color.BLACK,
          fontSize: 24,
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

    const result = createSolidDoughnutChartBaseOptions(config);

    expect(result).toEqual(expectedResult);
  });

  test('shuold create series', () => {
    const title = 'Demo';
    const expectedResult = [
      {
        name: title,
        type: 'pie',
        radius: ['55%', '80%'],
        label: {
          formatter: '{d}%',
          position: 'inside',
          color: Color.WHITE,
        },
      },
    ];

    const result = createSolidDoughnutChartSeries(title);

    expect(result).toEqual(expectedResult);
  });
});
