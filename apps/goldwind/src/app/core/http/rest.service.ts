import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DataService, GetOptions } from '@schaeffler/http';

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

  public getLoadDistribution(
    id: string,
    row: number
  ): Observable<LoadDistribution[]> {
    return this.getIot(`${id}/analytics/load-distribution`, {
      params: {
        row: [row.toString()],
      },
    });
  }

  public getLoadDistributionAverage({ id, startDate, endDate, row }: any) {
    return this.getIot(
      `${id}/analytics/load-distribution`,
      this.getParams(
        {
          startDate,
          endDate,
          aggregation: IAGGREGATIONTYPE.AVG,
        },
        { row }
      )
    );
  }

  public getEdm({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<EdmStatus[]> {
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

  public getEdmHistogram(
    { id, startDate, endDate }: IotParams,
    channel: string
  ): Observable<EdmHistogram[]> {
    return this.getIot(
      `${id}/analytics/histogram`,
      this.getParams(
        {
          startDate,
          endDate,
        },
        { channel }
      )
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

  public getGreaseHeatMap({
    deviceId,
    startDate,
  }: any): Observable<GCMHeatmapEntry[]> {
    const requestedYear = new Date(startDate * 1000).getFullYear();
    const yearStart = Date.parse(`${requestedYear}-01-01`) / 1000;
    const yearEnd = Date.parse(`${requestedYear}-12-31`) / 1000;

    return this.getIot(`${deviceId}/analytics/heatmap`, {
      params: { start: yearStart.toString(), end: yearEnd.toString() },
    });
  }

  public getParams(
    { endDate, startDate, aggregation, timebucketSeconds }: GWParams,
    extra?: any
  ): GetOptions {
    return {
      params: {
        ...(endDate && { end: String(endDate) }),
        ...(startDate && { start: String(startDate) }),
        ...(aggregation && { aggregation: String(aggregation) }),
        ...(timebucketSeconds !== undefined && {
          timebucketSeconds: String(timebucketSeconds),
        }),
        ...extra,
      },
    };
  }
}
