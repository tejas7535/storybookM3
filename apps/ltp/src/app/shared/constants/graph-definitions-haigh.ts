import { Series } from '../models';

export const GRAPH_DEFINITIONS_HAIGH: Series[] = [
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
    name: 'Beanspruchbarkeit ML-Modell',
    color: '#00893D',
    identifier: 'snCurve',
    legendDisplay: {
      name: 'prediction.chart.legendMl',
      color: '#00893D',
    },
  },
  {
    value: 'y3',
    name: 'Beanspruchbarkeit FKM-Richtlinie',
    color: '#fccf46',
    identifier: 'fkm',
    legendDisplay: {
      name: 'prediction.chart.legendFkm',
      color: '#fccf46',
    },
  },
  {
    value: 'y4',
    name: 'Beanspruchbarkeit Murakami-Modell',
    color: '#1d9bb2',
    identifier: 'murakami',
    legendDisplay: {
      name: 'prediction.chart.legendMurakami',
      color: '#1d9bb2',
    },
  },
  {
    value: 'y5',
    name: 'Beanspruchbarkeit statistisches Modell',
    color: '#9c27b0',
    identifier: 'statistical',
    legendDisplay: {
      name: 'prediction.chart.legendMurakami',
      color: '#9c27b0',
    },
  },
];
