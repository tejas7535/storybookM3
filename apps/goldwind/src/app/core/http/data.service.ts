import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { IotThing } from '../store/reducers/bearing/models';
import { Edm } from '../store/reducers/condition-monitoring/models';
import { ENV_CONFIG, EnvironmentConfig } from './environment-config.interface';

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
    return this.http.get<IotThing | Edm>(`${this.apiUrl}/iot/things/${path}`);
  }

  public getBearing(id: string): Observable<IotThing> {
    return this.getIot(id);
  }

  public getEdm(id: string): Observable<Edm> {
    return this.getIot(`${id}/edm`);
  }
}
