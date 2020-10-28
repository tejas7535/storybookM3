export const GREASE_STATUS_MOCK = {
  series: [
    {
      name: 'waterContent',
      radius: '33%',
      center: ['75%', '30%'],
      type: 'gauge',
      data: [
        {
          value: 12,
          name: 'TRANSLATE IT',
        },
      ],
      max: 100,
      splitNumber: 4,
      title: {
        show: true,
        fontSize: 14,
        fontWeight: 'bolder',
        offsetCenter: [0, '110%'],
      },
      detail: {
        color: '#646464',
        fontSize: 18,
        fontWeight: 'bolder',
        formatter: '{value} %',
      },
      pointer: {},
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.75, '#0ebc5b'],
            [0.85, '#fccf46'],
            [1, '#e62c27'],
          ],
        },
      },
      splitLine: {
        show: false,
        length: 20,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        distance: 0,
        show: false,
      },
    },
    {
      name: 'deteroration',
      radius: '33%',
      center: ['75%', '75%'],
      type: 'gauge',
      data: [
        {
          value: 55,
          name: 'TRANSLATE IT',
        },
      ],
      max: 100,
      splitNumber: 4,
      title: {
        show: true,
        fontSize: 14,
        fontWeight: 'bolder',
        offsetCenter: [0, '110%'],
      },
      detail: {
        color: '#646464',
        fontSize: 18,
        fontWeight: 'bolder',
        formatter: '{value} %',
      },
      pointer: {},
      axisLine: {
        lineStyle: {
          width: 12,
          color: [
            [0.75, '#0ebc5b'],
            [0.85, '#fccf46'],
            [1, '#e62c27'],
          ],
        },
      },
      splitLine: {
        show: false,
        length: 20,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        distance: 0,
        show: false,
      },
    },
  ],
};
