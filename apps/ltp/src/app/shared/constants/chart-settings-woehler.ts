import { ChartSettings } from '../models';
import { GRAPH_DEFINITIONS_WOEHLER } from './graph-definitions-woehler';

export const CHART_SETTINGS_WOEHLER: ChartSettings = {
  sources: GRAPH_DEFINITIONS_WOEHLER,
  argumentAxis: {
    title: '_PREDICTION.CHART.WOEHLER_X_LABEL',
    showLabel: true,
    format: 'exponential',
    showGrid: true,
    showMinorGrid: true,
    type: 'logarithmic'
  },
  valueAxis: {
    title: '_PREDICTION.CHART.WOEHLER_Y_LABEL',
    showLabel: false,
    format: '',
    showGrid: false,
    showMinorGrid: false,
    type: 'logarithmic'
  },
  customPointFn: (): Object => {
    return { visible: false };
  }
};
