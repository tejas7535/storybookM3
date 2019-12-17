import { Series } from '../models';

export const GRAPH_DEFINITIONS_HAIGH: Series[] = [
  {
    value: 'y1',
    name: 'Beanspruchung',
    color: '#A1C861',
    identifier: 'appliedStress',
    legendDisplay: {
      name: 'prediction.chart.legendLoad',
      color: '#A1C861'
    }
  },
  {
    value: 'y2',
    name: 'Beanspruchbarkeit ML-Modell',
    color: '#00893D',
    identifier: 'snCurve',
    legendDisplay: {
      name: 'prediction.chart.legendMl',
      color: '#00893D'
    }
  },
  {
    value: 'y3',
    name: 'Beanspruchbarkeit FKM-Richtlinie',
    color: 'red',
    identifier: 'fkm',
    legendDisplay: {
      name: 'prediction.chart.legendFkm',
      color: 'red'
    }
  },
  {
    value: 'y4',
    name: 'Beanspruchbarkeit Murakami-Modell',
    color: 'blue',
    identifier: 'murakami',
    legendDisplay: {
      name: 'prediction.chart.legendMurakami',
      color: 'blue'
    }
  }
];
