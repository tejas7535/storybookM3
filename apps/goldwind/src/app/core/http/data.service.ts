import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { BearingMetadata } from '../store/reducers/bearing/models';
import { SensorData } from '../store/reducers/data-view/models';
import { Device } from '../store/reducers/devices/models';
import { Edm } from '../store/reducers/edm-monitor/models';
import { GreaseStatus } from '../store/reducers/grease-status/models';
import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

interface IotParams {
  id: string;
  startDate: number;
  endDate: number;
}
@Injectable({
  providedIn: 'root',
})
export class DataService {
  public apiUrl: string;

  public constructor(
    @Inject(ENV_CONFIG) private readonly config: EnvironmentConfig,
    private readonly http: HttpClient
  ) {
    this.apiUrl = `${this.config.environment.baseUrl}`;
  }

  public getIot(path: string): Observable<any> {
    return this.http.get<BearingMetadata | Edm[] | GreaseStatus[]>(
      `${this.apiUrl}/iot/things/${path}`
    );
  }

  public getBearing(id: string): Observable<BearingMetadata> {
    return this.getIot(`${id}/metadata`);
  }

  public getEdm({ id, startDate, endDate }: IotParams): Observable<Edm[]> {
    return this.getIot(`${id}/edm/${startDate}/${endDate}`);
  }

  public getGreaseStatus({
    id,
    startDate,
    endDate,
  }: IotParams): Observable<GreaseStatus[]> {
    return this.getIot(`${id}/greasecheck/${startDate}/${endDate}`);
  }

  public getGreaseStatusLatest(id: string): Observable<GreaseStatus> {
    return this.getIot(`${id}/greasecheck/latest`);
  }

  public getDevices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.apiUrl}/device/listedgedevices`);
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
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
          notification: undefined,
        },
      ])
    );
  }
}
