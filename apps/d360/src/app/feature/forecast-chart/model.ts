import { SeriesOption } from 'echarts';

import {
  dimmedBlue,
  dimmedGreen,
  dimmedGrey,
  dimmedPurple,
  dimmedRed,
  dimmedYellow,
  textDarkGrey,
} from '../../shared/styles/colors';
import { PlanningView } from '../demand-validation/planning-view';

export interface ForecastChartData {
  chartUnitMode: ChartUnitMode;
  planningView: PlanningView;
  currency: string;
  chartEntries: MonthlyChartEntry[];
}

export const chartSeriesConfig = {
  deliveries: { color: dimmedGrey, isToggleable: false, order: 1 },
  orders: { color: dimmedYellow, isToggleable: false, order: 2 },
  onTopOrder: { color: dimmedGreen, isToggleable: true, order: 3 },
  onTopCapacityForecast: { color: dimmedBlue, isToggleable: true, order: 4 },
  salesAmbition: { color: dimmedPurple, isToggleable: true, order: 5 },
  opportunities: { color: dimmedRed, isToggleable: true, order: 6 },
  salesPlan: { color: textDarkGrey, isToggleable: false, order: 7 },
} as const;

export enum KpiValues {
  Deliveries = 'deliveries',
  Orders = 'orders',
  OnTopOrder = 'onTopOrder',
  OnTopCapacityForecast = 'onTopCapacityForecast',
  SalesAmbition = 'salesAmbition',
  Opportunities = 'opportunities',
  SalesPlan = 'salesPlan',
}

export type ChartValues = keyof typeof chartSeriesConfig;

export interface ChartEntry {
  orders: number;
  deliveries: number;
  onTopOrder: number;
  onTopCapacityForecast: number;
  opportunities: number;
  salesAmbition: number;
  salesPlan: number | null;
}

export type MonthlyChartEntry = ChartEntry & {
  yearMonth: string;
};

export type YearlyChartEntry = ChartEntry & {
  year: number;
};

export type KpiSeriesOption = SeriesOption & { kpi?: string };

export enum ChartUnitMode {
  CURRENCY = 'CURRENCY',
  QUANTITY = 'QUANTITY',
}

export enum PeriodType {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
}

export interface ChartSettings {
  startDate: Date | string;
  endDate: Date | string;
  planningView: PlanningView;
  chartUnitMode: ChartUnitMode;
  periodType: PeriodType;
}

export interface ChartSettingsStored {
  startDate: string;
  endDate: string;
  planningView: string;
  chartUnitMode: string;
  periodType: string;
}
