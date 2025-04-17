import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { catchError, map, Observable } from 'rxjs';

import { addYears, endOfYear, formatISO, startOfYear } from 'date-fns';

import { PlanningView } from '../demand-validation/planning-view';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import {
  ChartSettings,
  ChartSettingsStored,
  ChartUnitMode,
  ForecastChartData,
  PeriodType,
} from './model';

interface ForecastChartRequest {
  startDate: string;
  endDate: string;
  currency: string;
  chartUnitMode: ChartUnitMode;
  planningView: PlanningView;
  selectionFilters?: GlobalSelectionCriteriaFilters;
  columnFilters: Record<string, any>[];
  isCustomerNumberAssignedToMe?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ChartSettingsService {
  private readonly USER_CHART_SETTINGS_API = 'api/user-settings/chart';
  private readonly FORECASTCHART_DATA_API = 'api/forecast-chart';

  private readonly http = inject(HttpClient);

  public defaultChartSettings(defaultPeriodType: PeriodType) {
    return {
      startDate: startOfYear(Date.now()), // agreed upon default start date
      endDate: endOfYear(addYears(Date.now(), 1)), // agreed upon default end date
      planningView: PlanningView.REQUESTED,
      chartUnitMode: ChartUnitMode.CURRENCY,
      periodType: defaultPeriodType ?? PeriodType.MONTHLY,
    };
  }

  private parseChartSettings(raw: ChartSettingsStored): ChartSettings {
    return {
      startDate: new Date(Date.parse(raw.startDate)),
      endDate: new Date(Date.parse(raw.endDate)),
      planningView: raw.planningView as PlanningView,
      chartUnitMode: raw.chartUnitMode as ChartUnitMode,
      periodType: raw.periodType as PeriodType,
    };
  }

  public getForecastChartData(
    globalSelectionFilters: GlobalSelectionCriteriaFilters | undefined,
    columnFilters: Record<string, any>,
    chartSettings: ChartSettings,
    startDate: string,
    endDate: string,
    currency: string,
    isAssignedToMe?: boolean
  ): Observable<ForecastChartData> | null {
    const request: ForecastChartRequest = {
      startDate,
      endDate,
      currency,
      chartUnitMode: chartSettings.chartUnitMode,
      planningView: chartSettings.planningView,
      selectionFilters: globalSelectionFilters,
      columnFilters: [...(columnFilters ? [columnFilters] : [])],
    };

    if (isAssignedToMe !== undefined && isAssignedToMe !== null) {
      request.isCustomerNumberAssignedToMe = isAssignedToMe;
    }

    return globalSelectionFilters
      ? this.http.post<ForecastChartData>(this.FORECASTCHART_DATA_API, request)
      : null;
  }

  public getChartSettings(
    chartIdentifier: string,
    defaultPeriodType: PeriodType
  ): Observable<ChartSettings> {
    return this.http
      .get<ChartSettingsStored>(
        `${this.USER_CHART_SETTINGS_API}?chartIdentifier=${chartIdentifier}`
      )
      .pipe(
        map((response) => this.parseChartSettings(response)),
        catchError(async () => this.defaultChartSettings(defaultPeriodType))
      );
  }

  public updateChartSettings(
    chartSettings: ChartSettings,
    chartIdentifier: string
  ) {
    const request = {
      startDate: formatISO(chartSettings.startDate, { representation: 'date' }),
      endDate: formatISO(chartSettings.endDate, { representation: 'date' }),
      chartUnitMode: chartSettings.chartUnitMode,
      planningView: chartSettings.planningView,
      periodType: chartSettings.periodType,
    };

    return this.http.post<void>(
      `${this.USER_CHART_SETTINGS_API}?chartIdentifier=${chartIdentifier}`,
      request
    );
  }
}
