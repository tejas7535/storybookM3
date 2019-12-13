import { ChartSettings } from '../models';
import { GRAPH_DEFINITIONS_HAIGH } from './graph-definitions-haigh';

export const CHART_SETTINGS_HAIGH: ChartSettings = {
  sources: GRAPH_DEFINITIONS_HAIGH,
  argumentAxis: {
    title: '_PREDICTION.CHART.HAIGH_X_LABEL',
    showLabel: true,
    format: '',
    showGrid: true,
    showMinorGrid: true,
    type: 'continouus'
  },
  valueAxis: {
    title: '_PREDICTION.CHART.HAIGH_Y_LABEL',
    showLabel: true,
    format: '',
    showGrid: true,
    showMinorGrid: true,
    type: 'continouus'
  },
  customPointFn: (): Object => {
    return { visible: false };
  }
};
