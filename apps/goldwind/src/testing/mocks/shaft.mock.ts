export const SHAFT_LATEST_GRAPH_DATA = {
  series: {
    type: 'gauge',
    splitNumber: 4,
    title: {
      show: true,
      fontWeight: 'bolder',
      fontSize: 14,
      offsetCenter: [0, '110%'],
    },
    detail: {
      color: '#646464',
      fontSize: 18,
      fontWeight: 'bolder',
    },
    pointer: {
      show: false,
    },
    axisLine: {
      lineStyle: {
        width: 12,
        color: [
          [0.825, '#0ebc5b'],
          [0.9, '#fccf46'],
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
    },
    name: 'conditionMonitoring.shaft.rotorRotationSpeed',
    max: 20,
    data: [
      {
        value: '3.00',
        name: 'CONDITIONMONITORING.SHAFT.ROTORROTATIONSPEED',
      },
    ],
  },
};
