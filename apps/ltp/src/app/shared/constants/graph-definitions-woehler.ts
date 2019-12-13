import { Series } from '../models';

export const GRAPH_DEFINITIONS_WOEHLER: Series[] = [
  {
    value: 'y1',
    name: 'Beanspruchung',
    color: '#A1C861',
    identifier: 'appliedStress',
    legendDisplay: {
      name: '_PREDICTION.CHART.LEGEND_LOAD',
      color: '#A1C861'
    }
  },
  {
    value: 'y2',
    name: 'ML-Modell (P<sub>Ü</sub> 50)',
    color: '#00893D',
    identifier: 'snCurve',
    survivalProbability: 50,
    legendDisplay: {
      name: '_PREDICTION.CHART.LEGEND_ML',
      color: '#00893D'
    }
  },
  {
    value: 'y7',
    name: 'FKM-Richtlinie (P<sub>Ü</sub> 97,5)',
    color: 'red',
    identifier: 'fkm',
    survivalProbability: 97.5,
    legendDisplay: {
      name: '_PREDICTION.CHART.LEGEND_FKM',
      color: 'red'
    }
  },
  {
    value: 'y8',
    name: 'Murakami-Modell (P<sub>Ü</sub> 50)',
    color: 'blue',
    identifier: 'murakami',
    survivalProbability: 50,
    legendDisplay: {
      name: '_PREDICTION.CHART.LEGEND_MURAKAMI',
      color: 'blue'
    }
  },
  {
    value: 'y3',
    name: 'Konfidenzintervall1',
    color: '#003A54',
    identifier: 'percentile1',
    dashStyle: 'dash',
    survivalProbability: 1,
    legendDisplay: {
      name: '_PREDICTION.CHART.CONFIDENCE_INNER',
      color: 'transparent',
      borderStyle: 'dotted',
      borderWidth: 2,
      borderColor: '#003A54'
    }
  },
  {
    value: 'y4',
    name: 'Konfidenzintervall2',
    color: '#003A54',
    identifier: 'percentile99',
    dashStyle: 'dash',
    survivalProbability: 99
  },
  {
    value: 'y5',
    name: 'Konfidenzintervall3',
    color: '#777D7F',
    identifier: 'percentile10',
    dashStyle: 'dash',
    survivalProbability: 10
  },
  {
    value: 'y6',
    name: 'Konfidenzintervall4',
    color: '#777D7F',
    identifier: 'percentile90',
    dashStyle: 'dash',
    survivalProbability: 90
  }
];
