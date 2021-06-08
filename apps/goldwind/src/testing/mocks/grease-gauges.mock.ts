export const GREASE_STATUS_MOCK = {
  series: [
    {
      name: 'waterContent',
      center: ['50%', '50%'],
      type: 'gauge',
      data: [
        {
          value: 12.55,
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
        formatter: '12.55 %',
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
      name: 'deterioration',
      center: ['80%', '50%'],
      type: 'gauge',
      data: [
        {
          value: 55.55,
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
        formatter: '55.55 %',
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
      name: 'temperatureOptics',
      center: ['20%', '50%'],
      type: 'gauge',
      data: [
        {
          name: 'TRANSLATE IT',
          value: 99.99,
        },
      ],
      max: 120,
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
        formatter: '99.99 °C',
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
        show: true,
      },
    },
  ],
};
