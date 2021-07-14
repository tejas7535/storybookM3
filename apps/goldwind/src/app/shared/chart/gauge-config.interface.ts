export interface IThreshold {
  color: string;
  value: number;
}

export interface IGaugeConfig {
  MIN: number;
  MAX: number;
  TITLE_KEY: string;
  THRESHOLD_CONFIG: IThreshold[];
}
