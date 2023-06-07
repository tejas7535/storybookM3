import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { healthCheckFeature } from './health-check.reducer';

@Injectable({
  providedIn: 'root',
})
export class HealthCheckFacade {
  constructor(private readonly store: Store) {}

  healthCheckAvailable$ = this.store.select(
    healthCheckFeature.selectHealthCheckAvailable
  );
  healthCheckLoading$ = this.store.select(
    healthCheckFeature.selectHealthCheckLoading
  );
  error$ = this.store.select(healthCheckFeature.selectError);
}
