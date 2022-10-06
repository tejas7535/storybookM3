import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApplicationInsightsService } from '@schaeffler/application-insights';

import {
  PredictionRequest,
  PredictionResult,
  StatisticalPrediction,
  StatisticalRequest,
} from '../models';
import { environment } from './../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public SERVER_URL_PREDICTION = 'lifetime-predictor/ml-prediction/api';
  public SERVER_URL_STATISTICAL = 'lifetime-predictor/statistical/api';
  public SERVER_URL_LOADS = 'lifetime-predictor/loads/api';

  private readonly APPLICATION_INSIGHTS_ML_REQUEST = '[LTP - REQUEST - ML]';
  private readonly APPLICATION_INSIGHTS_STATISTICAL_REQUEST =
    '[LTP - REQUEST - STATISTICAL]';

  constructor(
    private readonly httpClient: HttpClient,
    private readonly applicationInsightsService: ApplicationInsightsService
  ) {}

  /**
   * posts prediction request and returns result of prediction
   */
  public postPrediction(
    predictionRequest: PredictionRequest,
    mode: number
  ): Observable<PredictionResult> {
    const {
      rrelation,
      v90,
      burdeningType,
      hv,
      hv_lower,
      hv_upper,
      model,
      mpa,
      spreading,
    } = predictionRequest;

    const prediction = {
      mode,
      v90,
      r: rrelation,
      belastungsart: burdeningType,
      haerte: hv,
      haerte_low: hv_lower,
      haerte_up: hv_upper,
      model_type: model,
      stress_amplitude: mpa,
      streubreite: spreading,
    };

    if (mode === 2) {
      return this.httpClient
        .post<any>(
          `${environment.baseUrl}/${this.SERVER_URL_PREDICTION}/score`,
          prediction
        )
        .pipe(
          map((res: any) => {
            this.applicationInsightsService.logEvent(
              this.APPLICATION_INSIGHTS_ML_REQUEST,
              { request: prediction, response: res }
            );

            return res;
          }),
          map((res: any) => {
            const result = res.prediction;

            return {
              woehler: {
                snCurve: result.woehler.sn_curve,
                snCurveLow: result.woehler.sn_curve_low ?? {},
                snCurveHigh: result.woehler.sn_curve_up ?? {},
                appliedStress: result.woehler.applied_stress,
                percentile1: result.woehler.percentile_1,
                percentile10: result.woehler.percentile_10,
                percentile90: result.woehler.percentile_90,
                percentile99: result.woehler.percentile_99,
              },
              haigh: {
                snCurve: result.haigh.sn_curve,
                appliedStress: result.haigh.applied_stress,
              },
              kpi: result.kpi,
            } as unknown as PredictionResult;
          })
        );
    }

    return this.httpClient
      .post<any>(
        `${environment.baseUrl}/${this.SERVER_URL_PREDICTION}/score`,
        prediction
      )
      .pipe(
        map((res: any) => {
          this.applicationInsightsService.logEvent(
            this.APPLICATION_INSIGHTS_ML_REQUEST,
            { request: prediction, response: res }
          );

          return res;
        })
      );
  }

  public postStatisticalService(
    statisticalRequest: StatisticalRequest
  ): Observable<StatisticalPrediction> {
    return this.httpClient
      .post<any>(
        `${environment.baseUrl}/${this.SERVER_URL_STATISTICAL}/score`,
        statisticalRequest
      )
      .pipe(
        map((res: any) => {
          this.applicationInsightsService.logEvent(
            this.APPLICATION_INSIGHTS_STATISTICAL_REQUEST,
            { request: statisticalRequest, response: res }
          );

          return res;
        })
      );
  }
}
