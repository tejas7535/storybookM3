import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { HealthCheckEffects } from './health-check.effects';
import { HealthCheckFacade } from './health-check.facade';
import { healthCheckFeature } from './health-check.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(healthCheckFeature),
    EffectsModule.forFeature([HealthCheckEffects]),
  ],
  providers: [HealthCheckFacade],
})
export class HealthCheckModule {}
