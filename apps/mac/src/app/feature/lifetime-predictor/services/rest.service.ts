import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@schaeffler/http';

import {
  Loads,
  LoadsNetworkRequest,
  PredictionRequest,
  PredictionResult,
  StatisticalPrediction,
  StatisticalRequest,
} from '../models';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public SERVER_URL_PREDICTION = 'lifetime-predictor/ml-prediction/api';
  public SERVER_URL_STATISTICAL = 'lifetime-predictor/statistical/api';
  public SERVER_URL_LOADS = 'lifetime-predictor/loads/api';

  constructor(private readonly dataService: DataService) {}

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
      return this.dataService
        .post<any>(`${this.SERVER_URL_PREDICTION}/score`, prediction)
        .pipe(
          map((res) => {
            const result = res.prediction;

            return {
              woehler: {
                snCurve: result.woehler.sn_curve,
                snCurveLow: result.woehler.sn_curve_low
                  ? result.woehler.sn_curve_low
                  : {},
                snCurveHigh: result.woehler.sn_curve_up
                  ? result.woehler.sn_curve_up
                  : {},
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

    return this.dataService.post<any>(
      `${this.SERVER_URL_PREDICTION}/score`,
      prediction
    );
  }

  /**
   * posts prediction and load request and returns result of whole calculation
   */
  public postLoadsData(loadsRequest: LoadsNetworkRequest): Observable<Loads> {
    const formData = new FormData();
    formData.append('method', loadsRequest.method);
    formData.append(
      'conversion_factor',
      loadsRequest.conversionFactor.toString()
    );
    formData.append(
      'repetition_factor',
      loadsRequest.repetitionFactor.toString()
    );
    formData.append(
      'fatigue_strength0',
      loadsRequest.fatigue_strength0.toString()
    );
    formData.append(
      'fatigue_strength1',
      loadsRequest.fatigue_strength1.toString()
    );
    formData.append(
      'loads',
      new File([JSON.stringify(loadsRequest.loads)], 'loadsCollective.json')
    );

    return this.dataService.post<any>(
      `${this.SERVER_URL_LOADS}/score`,
      formData
    );
  }

  public postStatisticalService(
    statisticalRequest: StatisticalRequest
  ): Observable<StatisticalPrediction> {
    return this.dataService.post<any>(
      `${this.SERVER_URL_STATISTICAL}/score`,
      statisticalRequest
    );
  }
}
