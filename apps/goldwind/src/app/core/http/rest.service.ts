import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import {
  CenterLoadStatus,
  GCMHeatmapEntry,
  IAGGREGATIONTYPE,
} from '../../shared/models';
import { BearingMetadata } from '../store/reducers/bearing/models';
import { Device } from '../store/reducers/devices/models';
import { EdmHistogram } from '../store/reducers/edm-monitor/edm-histogram.reducer';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {
  LoadDistributionEntity,
  IotParams,
  MaintenaceSensorData,
} from './types';

export interface LoadAssessmentData {
  timestamp: string;
}

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public apiUrl: string;

  public constructor(private readonly http: HttpClient) {
    this.apiUrl = `${environment.baseUrl}`;
  }

  public getBearing(id: string): Observable<BearingMetadata> {
    return this.http.get<BearingMetadata>(`${this.apiUrl}/things/${id}`);
  }

  public getEdmHistogram({
    id,
    start,
    end,
  }: IotParams): Observable<EdmHistogram> {
    return this.http.get<EdmHistogram>(
      `${this.apiUrl}/analyse/dashboard/${id}/edm/histogram`,
      {
        params: {
          start,
          end,
        },
      }
    );
  }

  public getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/device/listedgedevices`);
  }

  public getMaintenaceSensors({ id, start, end }: IotParams) {
    return this.http.get<MaintenaceSensorData[]>(
      `${this.apiUrl}/analyse/maintenance/${id}/sensors`,
      {
        params: {
          start,
          end,
        },
      }
    );
  }

  public getLoadAssessmentDistribution({
    id,
    start,
    end,
  }: IotParams): Observable<LoadAssessmentData[]> {
    return this.http.get<LoadAssessmentData[]>(
      `${this.apiUrl}/analyse/loadassessment/${id}/runchart`,
      {
        params: {
          start,
          end,
        },
      }
    );
  }

  public getBearingLoadDistribution({
    id,
    start,
    end,
  }: IotParams): Observable<LoadDistributionEntity> {
    return this.http.get<LoadDistributionEntity>(
      `${this.apiUrl}/analyse/loadassessment/${id}/distribution`,
      {
        params: start &&
          end && {
            start,
            end,
          },
      }
    );
  }

  public getCenterLoad({
    id,
    start,
    end,
  }: IotParams): Observable<CenterLoadStatus[]> {
    return this.http.get<CenterLoadStatus[]>(
      `${this.apiUrl}/analyse/loadassesment/${id}/centerload`,
      {
        params: {
          start,
          end,
          timebucketSeconds: 0,
          aggregation: IAGGREGATIONTYPE.AVG,
        },
      }
    );
  }

  public getGreaseHeatMap({
    deviceId,
    start,
  }: any): Observable<GCMHeatmapEntry[]> {
    const requestedYear = new Date(start * 1000).getFullYear();
    const yearStart = Date.parse(`${requestedYear}-01-01`) / 1000;
    const yearEnd = Date.parse(`${requestedYear}-12-31`) / 1000;

    return this.http.get<GCMHeatmapEntry[]>(
      `${this.apiUrl}/analyse/maintenance/${deviceId}/gcm/heatmap`,
      {
        params: { start: yearStart.toString(), end: yearEnd.toString() },
      }
    );
  }
}
