import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { BearingMetadata } from '../store/reducers/bearing/models';
import { Devices } from '../store/reducers/devices/models';
import { Edm } from '../store/reducers/edm-monitor/models';
import { GreaseStatus } from '../store/reducers/grease-status/models';
import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

interface EdmParams {
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
    return this.http.get<BearingMetadata | Edm | GreaseStatus>(
      `${this.apiUrl}/iot/things/${path}`
    );
  }

  public getBearing(id: string): Observable<BearingMetadata> {
    return this.getIot(`${id}/metadata`);
  }

  public getEdm({ id, startDate, endDate }: EdmParams): Observable<Edm> {
    return this.getIot(`${id}/edm/${startDate}/${endDate}`);
  }

  public getGreaseStatus(id: string): Observable<GreaseStatus> {
    return this.getIot(`${id}/greasecheck`);
  }

  public getDevices(): Observable<Devices> {
    return this.http.get<Devices>(`${this.apiUrl}/device/listedgedevices`);
  }
}
