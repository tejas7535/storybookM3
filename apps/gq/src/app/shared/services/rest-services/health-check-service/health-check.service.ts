import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { DataService } from '@schaeffler/http';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckService {
  private readonly PATH_HEALTH_CHECK = 'actuator/health';

  constructor(private readonly dataService: DataService) {}

  public pingHealthCheck(): Observable<true> {
    return this.dataService.getAll(this.PATH_HEALTH_CHECK);
  }
}
