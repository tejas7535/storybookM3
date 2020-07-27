import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  BurdeningType,
  Loads,
  LoadsNetworkRequest,
  Material,
  Model,
  Prediction,
  PredictionRequest,
  PredictionResult,
} from '../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public SERVER_URL = environment.SERVER_URL;

  constructor(private readonly httpService: HttpClient) {}

  /**
   * gets all model types from API
   */
  public getModels(): Observable<Model[]> {
    return this.httpService.get<Model[]>(`${this.SERVER_URL}/getModels`);
  }

  /**
   * gets all prediction types from API
   */
  public getPredictions(): Observable<Prediction[]> {
    return this.httpService.get<Prediction[]>(
      `${this.SERVER_URL}/getPredictions`
    );
  }

  /**
   * gets all burdening types from API
   */
  public getBurdeningTypes(): Observable<BurdeningType[]> {
    return this.httpService.get<BurdeningType[]>(
      `${this.SERVER_URL}/getBurdeningTypes`
    );
  }

  /**
   * gets all materials from static json file for now
   */
  public getMaterials(): Observable<Material[]> {
    return this.httpService.get<Material[]>(`${this.SERVER_URL}/getMaterials`);
  }

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
      R: rrelation,
      V90: v90,
      belastungsart: burdeningType,
      haerte: hv,
      haerte_low: hv_lower,
      haerte_up: hv_upper,
      model_type: model,
      stress_amplitude: mpa,
      streubreite: spreading,
    };

    if (mode === 2) {
      return this.httpService
        .post<any>(`${this.SERVER_URL}/predictor`, prediction)
        .pipe(
          map((res) => {
            const result = res.prediction;

            return ({
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
            } as unknown) as PredictionResult;
          })
        );
    }

    return this.httpService.post<any>(
      `${this.SERVER_URL}/predictor`,
      prediction
    );
  }

  /**
   * posts prediction and load request and returns result of whole calculation
   */
  public postLoadsData(loadsRequest: LoadsNetworkRequest): Observable<Loads> {
    return this.httpService.post<any>(`${this.SERVER_URL}/loads`, loadsRequest);
  }
}
