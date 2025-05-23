import { SeriesOption } from 'echarts';

import {
  darkGrey,
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

export interface SeriesConfig {
  color: string;
  isToggleable: boolean;
  order: number;
}

export interface ChartSeriesConfig {
  [KpiValues.BwDelta]?: SeriesConfig;
  [KpiValues.Deliveries]: SeriesConfig;
  [KpiValues.Orders]: SeriesConfig;
  [KpiValues.OnTopOrder]: SeriesConfig;
  [KpiValues.OnTopCapacityForecast]: SeriesConfig;
  [KpiValues.SalesAmbition]: SeriesConfig;
  [KpiValues.Opportunities]: SeriesConfig;
  [KpiValues.SalesPlan]: SeriesConfig;
}

export const chartSeriesConfig: ChartSeriesConfig = {
  bwDelta: { color: darkGrey, isToggleable: false, order: 2 }, // optional, only for sales data
  deliveries: { color: dimmedGrey, isToggleable: false, order: 1 },
  onTopCapacityForecast: { color: dimmedBlue, isToggleable: true, order: 5 },
  onTopOrder: { color: dimmedGreen, isToggleable: true, order: 4 },
  opportunities: { color: dimmedRed, isToggleable: true, order: 7 },
  orders: { color: dimmedYellow, isToggleable: false, order: 3 },
  salesAmbition: { color: dimmedPurple, isToggleable: true, order: 6 },
  salesPlan: { color: textDarkGrey, isToggleable: false, order: 8 },
} as const;

export enum KpiValues {
  BwDelta = 'bwDelta',
  Deliveries = 'deliveries',
  OnTopCapacityForecast = 'onTopCapacityForecast',
  OnTopOrder = 'onTopOrder',
  Opportunities = 'opportunities',
  Orders = 'orders',
  SalesAmbition = 'salesAmbition',
  SalesPlan = 'salesPlan',
}

export type ChartValues = keyof typeof chartSeriesConfig;

export interface ChartEntry {
  bwDelta: number | null;
  deliveries: number;
  onTopCapacityForecast: number;
  onTopOrder: number;
  opportunities: number;
  orders: number;
  salesAmbition: number;
  salesPlan: number | null;
}

export type MonthlyChartEntry = ChartEntry & {
  yearMonth: string;
};

export type YearlyChartEntry = ChartEntry & {
  year: number;
};

export interface CleanedUpNegativeData {
  actualValue: number;
  value: number;
}

export type KpiSeriesOption = SeriesOption & { kpi?: string };

export enum ChartUnitMode {
  CURRENCY = 'CURRENCY',
  QUANTITY = 'QUANTITY',
}

export enum PeriodType {
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface ChartSettings {
  chartUnitMode: ChartUnitMode;
  endDate: Date | string;
  periodType: PeriodType;
  planningView: PlanningView;
  startDate: Date | string;
}

export interface ChartSettingsStored {
  chartUnitMode: string;
  endDate: string;
  periodType: string;
  planningView: string;
  startDate: string;
}
