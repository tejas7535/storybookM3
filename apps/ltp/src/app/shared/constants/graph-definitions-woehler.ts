import { Series } from '../models';

export const GRAPH_DEFINITIONS_WOEHLER: Series[] = [
  {
    value: 'y1',
    name: 'Beanspruchung',
    color: '#A1C861',
    identifier: 'appliedStress',
    legendDisplay: {
      name: 'prediction.chart.legendLoad',
      color: '#A1C861',
    },
  },
  {
    value: 'y2',
    name: 'ML-Modell (P<sub>Ü</sub> 50)',
    color: '#00893D',
    identifier: 'snCurve',
    survivalProbability: 50,
    legendDisplay: {
      name: 'prediction.chart.legendMl',
      color: '#00893D',
    },
  },
  {
    value: 'y7',
    name: 'FKM-Richtlinie (P<sub>Ü</sub> 97,5)',
    color: '#fccf46',
    identifier: 'fkm',
    survivalProbability: 97.5,
    legendDisplay: {
      name: 'prediction.chart.legendFkm',
      color: '#fccf46',
    },
  },
  {
    value: 'y8',
    name: 'Murakami-Modell (P<sub>Ü</sub> 50)',
    color: '#1d9bb2',
    identifier: 'murakami',
    survivalProbability: 50,
    legendDisplay: {
      name: 'prediction.chart.legendMurakami',
      color: '#1d9bb2',
    },
  },
  {
    value: 'y3',
    name: 'Konfidenzintervall1',
    color: '#003A54',
    identifier: 'percentile1',
    dashStyle: 'dash',
    survivalProbability: 1,
    legendDisplay: {
      name: 'prediction.chart.confidenceInner',
      color: 'transparent',
      borderStyle: 'dotted',
      borderWidth: 2,
      borderColor: '#003A54',
    },
  },
  {
    value: 'y4',
    name: 'Konfidenzintervall2',
    color: '#003A54',
    identifier: 'percentile99',
    dashStyle: 'dash',
    survivalProbability: 99,
  },
  {
    value: 'y5',
    name: 'Konfidenzintervall3',
    color: '#777D7F',
    identifier: 'percentile10',
    dashStyle: 'dash',
    survivalProbability: 10,
  },
  {
    value: 'y6',
    name: 'Konfidenzintervall4',
    color: '#777D7F',
    identifier: 'percentile90',
    dashStyle: 'dash',
    survivalProbability: 90,
  },
  {
    value: 'y',
    name: 'Lastkurve',
    color: '#e62c27',
    identifier: 'loads',
    legendDisplay: {
      name: 'ld',
      color: '#e62c27',
    },
  },
];
