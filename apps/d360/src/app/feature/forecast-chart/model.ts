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
  [KpiValues.BwDelta]: { color: darkGrey, isToggleable: false, order: 2 }, // optional, only for sales data
  [KpiValues.Deliveries]: { color: dimmedGrey, isToggleable: false, order: 1 },
  [KpiValues.OnTopCapacityForecast]: {
    color: dimmedBlue,
    isToggleable: true,
    order: 5,
  },
  [KpiValues.OnTopOrder]: { color: dimmedGreen, isToggleable: true, order: 4 },
  [KpiValues.Opportunities]: { color: dimmedRed, isToggleable: true, order: 7 },
  [KpiValues.Orders]: { color: dimmedYellow, isToggleable: false, order: 3 },
  [KpiValues.SalesAmbition]: {
    color: dimmedPurple,
    isToggleable: true,
    order: 6,
  },
  [KpiValues.SalesPlan]: { color: textDarkGrey, isToggleable: false, order: 8 },
} as const;

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
