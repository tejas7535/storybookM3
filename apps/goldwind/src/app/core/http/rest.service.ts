import { Inject, Injectable, InjectionToken } from '@angular/core';

import { Observable, of } from 'rxjs';

import { BearingMetadata } from '../store/reducers/bearing/models';
import { SensorData } from '../store/reducers/data-view/models';
import { Device } from '../store/reducers/devices/models';
import { EdmStatus } from '../store/reducers/edm-monitor/models';
import { GcmStatus } from '../store/reducers/grease-status/models';
import { LoadSense } from '../store/reducers/load-sense/models';
import { ShaftStatus } from '../store/reducers/shaft/models';
import { StaticSafetyStatus } from '../store/reducers/static-safety/models';
import {
  CenterLoadStatus,
  GCMHeatmapEntry,
  GWParams,
  IAGGREGATIONTYPE,
} from '../../shared/models';
import { EdmHistogram } from '../store/reducers/edm-monitor/edm-histogram.reducer';
import { LoadDistribution } from '../store/selectors/load-distribution/load-distribution.interface';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface IotParams {
  id: string;
  start: number;
  end: number;
}
interface EnvironmentConfig {
  environment: {
    baseUrl: string;
  };
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

  public getLoadDistribution(
    id: string,
    row: number
  ): Observable<LoadDistribution[]> {
    return this.http.get<LoadDistribution[]>(
      `${this.apiUrl}/things/${id}/analytics/load-distribution`,
      {
        params: {
          row: [row.toString()],
        },
      }
    );
  }

  public getLoadDistributionAverage({ id, start, end, row }: any) {
    return this.http.get<any[]>(
      `${this.apiUrl}/things/${id}/analytics/load-distribution`,
      {
        params: {
          start,
          end,
          aggregation: IAGGREGATIONTYPE.AVG,
          row,
        },
      }
    );
  }

  public getEdm({ id, start, end }: IotParams): Observable<EdmStatus[]> {
    return this.http.get<EdmStatus[]>(
      `${this.apiUrl}/things/${id}/sensors/electric-discharge/telemetry`,
      {
        params: {
          start,
          end,
          timebucketSeconds: -1,
          aggregation: IAGGREGATIONTYPE.AVG,
        },
      }
    );
  }

  public getEdmHistogram(
    { id, start, end }: IotParams,
    channel: string
  ): Observable<EdmHistogram[]> {
    return this.http.get<EdmHistogram[]>(
      `${this.apiUrl}/things/${id}/analytics/histogram`,
      {
        params: {
          start,
          end,
          channel,
        },
      }
    );
  }

  public getGreaseStatus({
    id,
    start,
    end,
  }: IotParams): Observable<GcmStatus[]> {
    return this.http.get<GcmStatus[]>(
      `${this.apiUrl}/things/${id}/sensors/grease-status/telemetry`,
      {
        params: {
          start,
          end,
        },
      }
    );
  }

  public getGreaseStatusLatest(id: string): Observable<GcmStatus[]> {
    return this.http.get<GcmStatus[]>(
      `${this.apiUrl}/things/${id}/sensors/grease-status/telemetry`
    );
  }

  public getShaftLatest(id: string): Observable<ShaftStatus[]> {
    return this.http.get<ShaftStatus[]>(
      `${this.apiUrl}/things/${id}/sensors/rotation-speed/telemetry`
    );
  }

  public getShaft({ id, start, end }: IotParams): Observable<ShaftStatus[]> {
    return this.http.get<ShaftStatus[]>(
      `${this.apiUrl}/things/${id}/sensors/rotation-speed/telemetry`,
      {
        params: {
          start,
          end,
          timebucketSeconds: 3600,
          aggregation: IAGGREGATIONTYPE.AVG,
        },
      }
    );
  }

  public getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/device/listedgedevices`);
  }

  public getBearingLoad({
    id,
    start,
    end,
  }: IotParams): Observable<LoadSense[]> {
    return this.http.get<LoadSense[]>(
      `${this.apiUrl}/things/${id}/sensors/bearing-load/telemetry`,
      {
        params: {
          start,
          end,
          timebucketSeconds: -1,
          aggregation: IAGGREGATIONTYPE.AVG,
        },
      }
    );
  }

  public getBearingLoadLatest(deviceId: string): Observable<LoadSense[]> {
    return this.http.get<LoadSense[]>(
      `${this.apiUrl}/things/${deviceId}/sensors/bearing-load/telemetry`
    );
  }

  public getBearingLoadAverage({
    id: deviceID,
    start,
    end,
  }: IotParams): Observable<LoadSense[]> {
    return this.http.get<LoadSense[]>(
      `${this.apiUrl}/things/${deviceID}/sensors/bearing-load/telemetry`,
      {
        params: {
          start,
          end,
          timebucketSeconds: -1,
          aggregation: IAGGREGATIONTYPE.AVG,
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
      `${this.apiUrl}/things/${id}/analytics/center-load`,
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

  public getData({ id, start, end }: IotParams): Observable<SensorData[]> {
    return (
      id &&
      start &&
      end &&
      of([
        {
          type: 'Load',
          description: 'Radial Load y',
          abreviation: 'F_y',
          designValue: undefined,
          actualValue: 1635,
          minValue: 1700,
          maxValue: 1900,
          notification: undefined,
        },
      ])
    );
  }

  public getStaticSafety(id: string): Observable<StaticSafetyStatus[]> {
    return this.http.get<StaticSafetyStatus[]>(
      `${this.apiUrl}/things/${id}/analytics/static-safety-factor`
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
      `${this.apiUrl}/things/${deviceId}/analytics/heatmap`,
      {
        params: { start: yearStart.toString(), end: yearEnd.toString() },
      }
    );
  }
}
