import { ChartSettings } from '../models';
import { GRAPH_DEFINITIONS_WOEHLER } from './graph-definitions-woehler';

export const CHART_SETTINGS_WOEHLER: ChartSettings = {
  sources: GRAPH_DEFINITIONS_WOEHLER,
  argumentAxis: {
    title: 'prediction.chart.woehlerXLabel',
    showLabel: true,
    format: 'exponential',
    showGrid: true,
    showMinorGrid: true,
    type: 'logarithmic',
  },
  valueAxis: {
    title: 'prediction.chart.woehlerYLabel',
    showLabel: false,
    format: '',
    showGrid: false,
    showMinorGrid: false,
    type: 'logarithmic',
  },
  customPointFn: (): Object => {
    return { visible: false };
  },
};
