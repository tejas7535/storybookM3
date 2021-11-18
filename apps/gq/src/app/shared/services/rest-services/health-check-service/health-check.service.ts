import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ApiVersion } from '../../../models';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  private readonly PATH_HEALTH_CHECK = 'actuator/health';

  constructor(private readonly http: HttpClient) {}

  public pingHealthCheck(): Observable<boolean> {
    return this.http.get<boolean>(`${ApiVersion.V1}/${this.PATH_HEALTH_CHECK}`);
  }
}
