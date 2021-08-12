import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DataService, GetOptions } from '@schaeffler/http';

import { BearingMetadata } from '../store/reducers/bearing/models';
import { SensorData } from '../store/reducers/data-view/models';
import { Device } from '../store/reducers/devices/models';
import { Edm } from '../store/reducers/edm-monitor/models';
import { GcmStatus } from '../store/reducers/grease-status/models';
import { LoadSense } from '../store/reducers/load-sense/models';
import { ShaftStatus } from '../store/reducers/shaft/models';
import { StaticSafetyStatus } from '../store/reducers/static-safety/models';
import {
  CenterLoadStatus,
  GCMHeatmapClassification,
  GCMHeatmapEntry,
  GWParams,
  IAGGREGATIONTYPE,
} from '../../shared/models';

export interface IotParams {
  id: string;
  startDate: number;
  endDate: number;
}

@Injectable({
  providedIn: 'root',
})
export class RestService {
  public apiUrl: string;

  public constructor(private readonly dataService: DataService) {}

  public getIot(path: string, options?: GetOptions): Observable<any> {
    return this.dataService.getAll(`things/${path}`, options);
  }

  public getBearing(id: string): Observable<BearingMetadata> {
    return this.getIot(`${id}`);
  }

  public getEdm({ id, startDate, endDate }: IotParams): Observable<Edm[]> {
    return this.getIot(
      `${id}/sensors/electric-discharge/telemetry`,
      this.getParams({
        startDate,
        endDate,
        timebucketSeconds: -1,
        aggregation: IAGGREGATIONTYPE.AVG,
      })
    );
  }

  public getGreaseStatus({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<GcmStatus[]> {
    return this.getIot(
      `${id}/sensors/grease-status/telemetry`,
      this.getParams({ startDate, endDate })
    );
  }

  public getGreaseStatusLatest(id: string): Observable<GcmStatus[]> {
    return this.getIot(`${id}/sensors/grease-status/telemetry`);
  }

  public getShaftLatest(id: string): Observable<ShaftStatus[]> {
    return this.getIot(`${id}/sensors/rotation-speed/telemetry`);
  }

  public getShaft({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<ShaftStatus[]> {
    return this.getIot(
      `${id}/sensors/rotation-speed/telemetry`,
      this.getParams({
        startDate,
        endDate,
        timebucketSeconds: 3600,
        aggregation: IAGGREGATIONTYPE.AVG,
      })
    );
  }

  public getDevices(): Observable<Device[]> {
    return this.dataService.getAll<Device[]>(`device/listedgedevices`);
  }

  public getBearingLoad({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<LoadSense[]> {
    return this.getIot(
      `${id}/sensors/bearing-load/telemetry`,
      this.getParams({
        startDate,
        endDate,
        timebucketSeconds: 3600,
        aggregation: IAGGREGATIONTYPE.AVG,
      })
    );
  }

  public getBearingLoadLatest(deviceId: string): Observable<LoadSense[]> {
    return this.getIot(`${deviceId}/sensors/bearing-load/telemetry`);
  }

  public getBearingLoadAverage({
    id: deviceID,
    startDate,
    endDate,
  }: IotParams): Observable<LoadSense[]> {
    return this.getIot(
      `${deviceID}/sensors/bearing-load/telemetry`,
      this.getParams({
        startDate,
        endDate,
        timebucketSeconds: -1,
        aggregation: IAGGREGATIONTYPE.AVG,
      })
    );
  }
  public getCenterLoad({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<CenterLoadStatus[]> {
    return this.getIot(
      `${id}/analytics/center-load`,
      this.getParams({
        startDate,
        endDate,
        timebucketSeconds: 0,
        aggregation: IAGGREGATIONTYPE.AVG,
      })
    );
  }
  public getData({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<SensorData[]> {
    return (
      id &&
      startDate &&
      endDate &&
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
    return this.getIot(`${id}/analytics/static-safety-factor`);
  }

  // TODO: realcall: public getGreaseHeatMap({ deviceId, end, start, channel }: any): any {
  public getGreaseHeatMap(): Observable<GCMHeatmapEntry[]> {
    return of([
      {
        timestamp: new Date().toISOString(),
        gcm01DeteriorationClassification: GCMHeatmapClassification.OKAY,
        gcm01DeteriorationMax: 50,
        gcm01TemperatureOpticsClassification: GCMHeatmapClassification.WARNING,
        gcm01TemperatureOpticsMax: 20,
        gcm01WaterContentClassification: GCMHeatmapClassification.OKAY,
        gcm01WaterContentMax: 0,
        gcm02DeteriorationClassification: GCMHeatmapClassification.OKAY,
        gcm02DeteriorationMax: 50,
        gcm02TemperatureOpticsClassification: GCMHeatmapClassification.OKAY,
        gcm02TemperatureOpticsMax: 20,
        gcm02WaterContentClassification: GCMHeatmapClassification.OKAY,
        gcm02WaterContentMax: 0,
      },
      {
        timestamp: '2021-01-01',
        gcm01DeteriorationClassification: GCMHeatmapClassification.ERROR,
        gcm01DeteriorationMax: 555,
        gcm01TemperatureOpticsClassification: GCMHeatmapClassification.WARNING,
        gcm01TemperatureOpticsMax: 222,
        gcm01WaterContentClassification: GCMHeatmapClassification.OKAY,
        gcm01WaterContentMax: 0,
        gcm02DeteriorationClassification: GCMHeatmapClassification.ERROR,
        gcm02DeteriorationMax: 222,
        gcm02TemperatureOpticsClassification: GCMHeatmapClassification.WARNING,
        gcm02TemperatureOpticsMax: 222,
        gcm02WaterContentClassification: GCMHeatmapClassification.OKAY,
        gcm02WaterContentMax: 0,
      },
      {
        timestamp: '2021-12-30',
        gcm01DeteriorationClassification: GCMHeatmapClassification.OKAY,
        gcm01DeteriorationMax: 555,
        gcm01TemperatureOpticsClassification: GCMHeatmapClassification.OKAY,
        gcm01TemperatureOpticsMax: 222,
        gcm01WaterContentClassification: GCMHeatmapClassification.OKAY,
        gcm01WaterContentMax: 0,
        gcm02DeteriorationClassification: GCMHeatmapClassification.OKAY,
        gcm02DeteriorationMax: 222,
        gcm02TemperatureOpticsClassification: GCMHeatmapClassification.OKAY,
        gcm02TemperatureOpticsMax: 222,
        gcm02WaterContentClassification: GCMHeatmapClassification.OKAY,
        gcm02WaterContentMax: 0,
      },
    ] as GCMHeatmapEntry[]);
    // return this.getIot(
    //   // `${deviceId}/analytics/heatmap?start=${start}&end=${end}&channel=${channel}`
    //   `${deviceId}/analytics/heatmap`
    // );
  }

  public getParams({
    endDate,
    startDate,
    aggregation,
    timebucketSeconds,
  }: GWParams): GetOptions {
    return {
      params: {
        ...(endDate && { end: String(endDate) }),
        ...(startDate && { start: String(startDate) }),
        ...(aggregation && { aggregation: String(aggregation) }),
        ...(timebucketSeconds !== undefined && {
          timebucketSeconds: String(timebucketSeconds),
        }),
      },
    };
  }
}
