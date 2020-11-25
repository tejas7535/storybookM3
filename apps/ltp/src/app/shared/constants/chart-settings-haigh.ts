import { ChartSettings } from '../models';
import { GRAPH_DEFINITIONS_HAIGH } from './graph-definitions-haigh';

export const CHART_SETTINGS_HAIGH: ChartSettings = {
  sources: GRAPH_DEFINITIONS_HAIGH,
  argumentAxis: {
    title: 'prediction.chart.haighXLabel',
    showLabel: true,
    format: '',
    showGrid: true,
    showMinorGrid: true,
    type: 'continouus',
  },
  valueAxis: {
    title: 'prediction.chart.haighYLabel',
    showLabel: true,
    format: '',
    showGrid: true,
    showMinorGrid: true,
    type: 'continouus',
  },
  customPointFn: (): Object => {
    return { visible: false };
  },
};
