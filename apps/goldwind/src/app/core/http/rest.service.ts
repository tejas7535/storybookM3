import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { BearingMetadata } from '../store/reducers/bearing/models';
import { SensorData } from '../store/reducers/data-view/models';
import { Device } from '../store/reducers/devices/models';
import { Edm } from '../store/reducers/edm-monitor/models';
import { GcmStatus } from '../store/reducers/grease-status/models';
import { LoadSense } from '../store/reducers/load-sense/models';
import { ShaftStatus } from '../store/reducers/shaft/models';
import { StaticSafetyStatus } from '../store/reducers/static-safety/models';

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

  public getIot(path: string): Observable<any> {
    return this.dataService.getAll(`things/${path}`);
  }

  public getBearing(id: string): Observable<BearingMetadata> {
    return this.getIot(`${id}`);
  }

  public getEdm({ id, startDate, endDate }: IotParams): Observable<Edm[]> {
    return this.getIot(
      `${id}/sensors/electric-discharge/telemetry?start=${startDate}&end=${endDate}`
    );
  }

  public getGreaseStatus({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<GcmStatus[]> {
    return this.getIot(
      `${id}/sensors/grease-status/telemetry?start=${startDate}&end=${endDate}`
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
      `${id}/sensors/rotation-speed/telemetry?start=${startDate}&end=${endDate}&timebucketSeconds=3600&aggregation=AVG`
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
      `${id}/sensors/bearing-load/telemetry?start=${startDate}&end=${endDate}&timebucketSeconds=3600&aggregation=AVG`
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
      `${deviceID}/sensors/bearing-load/telemetry?agg=avg&end=${endDate}&start=${startDate}&timebucketSeconds=-1`
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
}
