import { Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';

import { DataService } from '@schaeffler/http';

import { BearingMetadata } from '../store/reducers/bearing/models';
import { SensorData } from '../store/reducers/data-view/models';
import { Device } from '../store/reducers/devices/models';
import { Edm } from '../store/reducers/edm-monitor/models';
import { GreaseStatus } from '../store/reducers/grease-status/models';

interface IotParams {
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
    return this.dataService.getAll<BearingMetadata | Edm[] | GreaseStatus[]>(
      `iot/things/${path}`
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
    return this.dataService.getAll<Device[]>(`device/listedgedevices`);
  }

  public getLoad(id: string): Observable<any> {
    return (
      id &&
      of({
        id: '123',
        message: 'testmessage',
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
          actualValue: 1635.0,
          minValue: 1700.0,
          maxValue: 1900.0,
          notification: undefined,
        },
      ])
    );
  }
}
