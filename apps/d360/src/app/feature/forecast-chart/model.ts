import {
  dimmedBlue,
  dimmedGreen,
  dimmedGrey,
  dimmedRed,
  dimmedYellow,
  textDarkGrey,
} from '../../shared/styles/colors';
import { PlanningView } from '../demand-validation/planning-view';

export interface ForecastChartData {
  chartUnitMode: ChartUnitMode;
  planningView: PlanningView;
  currency: string;
  chartEntries: ChartEntry[];
}

export const chartSeriesConfig = {
  orders: { color: dimmedYellow },
  deliveries: { color: dimmedGrey },
  demandPlan: { color: dimmedGreen },
  opportunities: { color: dimmedRed },
  opAdjustment: { color: dimmedBlue },
  rollingSalesForecast: { color: textDarkGrey },
} as const;

export type ChartValues = keyof typeof chartSeriesConfig;

export interface ChartEntry {
  yearMonth: string;
  orders: number;
  deliveries: number;
  demandPlan: number;
  opportunities: number;
  opAdjustment: number;
  rollingSalesForecast: number | null;
}

export enum ChartUnitMode {
  CURRENCY = 'CURRENCY',
  QUANTITY = 'QUANTITY',
}

export interface ChartSettings {
  startDate: Date | string;
  endDate: Date | string;
  planningView: PlanningView;
  chartUnitMode: ChartUnitMode;
}

export interface ChartSettingsStored {
  startDate: string;
  endDate: string;
  planningView: string;
  chartUnitMode: string;
}
