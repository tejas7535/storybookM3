import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { catchError, map, Observable } from 'rxjs';

import { addYears, endOfYear, formatISO, startOfYear } from 'date-fns';

import { PlanningView } from '../demand-validation/planning-view';
import { GlobalSelectionCriteriaFilters } from '../global-selection/model';
import { CurrencyService } from '../info/currency.service';
import {
  ChartSettings,
  ChartSettingsStored,
  ChartUnitMode,
  ForecastChartData,
} from './model';

@Injectable({
  providedIn: 'root',
})
export class ChartSettingsService {
  private readonly USER_CHART_SETTINGS_API = 'api/user-settings/chart';
  private readonly FORECASTCHART_DATA_API = 'api/forecast-chart';

  private readonly http = inject(HttpClient);
  private readonly currencyService = inject(CurrencyService);
  private readonly currentCurrency = toSignal(
    this.currencyService.getCurrentCurrency()
  );

  readonly defaultChartSettings: ChartSettings = {
    startDate: startOfYear(Date.now()), // agreed upon default start date
    endDate: endOfYear(addYears(Date.now(), 1)), // agreed upon default end date
    planningView: PlanningView.REQUESTED,
    chartUnitMode: ChartUnitMode.CURRENCY,
  };

  parseChartSettings(raw: ChartSettingsStored): ChartSettings {
    return {
      startDate: new Date(Date.parse(raw.startDate)),
      endDate: new Date(Date.parse(raw.endDate)),
      planningView: raw.planningView as PlanningView,
      chartUnitMode: raw.chartUnitMode as ChartUnitMode,
    };
  }

  getForecastChartData(
    globalSelectionFilters: GlobalSelectionCriteriaFilters | undefined,
    columnFilters: Record<string, any>,
    chartSettings: ChartSettings
  ): Observable<ForecastChartData> | null {
    const request = {
      startDate: formatISO(chartSettings.startDate, { representation: 'date' }),
      endDate: formatISO(chartSettings.endDate, { representation: 'date' }),
      currency: this.currentCurrency(),
      chartUnitMode: chartSettings.chartUnitMode,
      planningView: chartSettings.planningView,
      selectionFilters: globalSelectionFilters,
      columnFilters: [...(columnFilters ? [columnFilters] : [])],
    };

    return globalSelectionFilters
      ? this.http.post<ForecastChartData>(this.FORECASTCHART_DATA_API, request)
      : null;
  }

  getChartSettings(): Observable<ChartSettings> {
    return this.http
      .get<ChartSettingsStored>(this.USER_CHART_SETTINGS_API)
      .pipe(
        map((response) => this.parseChartSettings(response)),
        catchError(async () => this.defaultChartSettings)
      );
  }

  updateChartSettings(chartSettings: ChartSettings): Observable<void> {
    const request = {
      startDate: formatISO(chartSettings.startDate, { representation: 'date' }),
      endDate: formatISO(chartSettings.endDate, { representation: 'date' }),
      chartUnitMode: chartSettings.chartUnitMode,
      planningView: chartSettings.planningView,
    };

    return this.http.post<void>(this.USER_CHART_SETTINGS_API, request);
  }
}
