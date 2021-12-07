import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DevicesEffects } from '../core/store/effects/devices/devices.effects';
import { devicesReducer } from '../core/store/reducers/devices/devices.reducer';
import { SharedModule } from '../shared/shared.module';
import { StatusIndicatorModule } from '../shared/status-indicator/status-indicator.module';
import { OverviewComponent } from './overview.component';
import { OverviewRoutingModule } from './overview-routing.module';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    OverviewRoutingModule,
    SharedModule,
    StatusIndicatorModule,

    // UI Modules
    MatButtonModule,
    MatCardModule,
    MatDividerModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([DevicesEffects]),
    StoreModule.forFeature('devices', devicesReducer),
    ReactiveComponentModule,
  ],
})
export class OverviewModule {}
