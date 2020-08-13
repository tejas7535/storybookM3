import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingEffects } from '../core/store/effects/bearing/bearing.effects';
import { bearingReducer } from '../core/store/reducers/bearing/bearing.reducer';
import { SharedModule } from '../shared/shared.module';
import { BearingRoutingModule } from './bearing-routing.module';
import { BearingComponent } from './bearing.component';

@NgModule({
  declarations: [BearingComponent],
  imports: [
    CommonModule,
    BearingRoutingModule,
    SharedModule,

    // UI Modules
    MatTabsModule,
    MatIconModule,

    // Translation
    SharedTranslocoModule,

    // Store
    EffectsModule.forFeature([BearingEffects]),
    StoreModule.forFeature('bearing', bearingReducer),
  ],
})
export class BearingModule {}
