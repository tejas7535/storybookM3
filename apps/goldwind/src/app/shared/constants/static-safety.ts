import { GaugeColors } from '../chart/chart';
import { IGaugeConfig } from '../chart/gauge-config.interface';

export const STATIC_STAFETY_SETTINGS: IGaugeConfig = {
  MIN: 0,
  MAX: 50,
  TITLE_KEY: 'conditionMonitoring.static-saftey-factor-monitor.factor',
  THRESHOLD_CONFIG: [
    { color: GaugeColors.GREEN, value: 2 },
    { color: GaugeColors.YELLOW, value: 1 },
    { color: GaugeColors.RED, value: 0 },
  ],
};
