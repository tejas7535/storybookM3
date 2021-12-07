import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '../core/store/effects/bearing/bearing.effects';
import { bearingReducer } from '../core/store/reducers/bearing/bearing.reducer';
import { SharedModule } from '../shared/shared.module';
import { BearingComponent } from './bearing.component';
import { BearingRoutingModule } from './bearing-routing.module';

@NgModule({
  declarations: [BearingComponent],
  imports: [
    CommonModule,
    BearingRoutingModule,
    SharedModule,

    // UI Modules
    MatTabsModule,
    SubheaderModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([BearingEffects]),
    StoreModule.forFeature('bearing', bearingReducer),
    ReactiveComponentModule,
  ],
})
export class BearingModule {}
