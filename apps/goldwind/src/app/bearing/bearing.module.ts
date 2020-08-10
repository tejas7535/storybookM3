import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ThingEffects } from '../core/store/effects/thing/thing.effects';
import { thingReducer } from '../core/store/reducers/thing/thing.reducer';
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
    EffectsModule.forFeature([ThingEffects]),
    StoreModule.forFeature('thing', thingReducer),
  ],
})
export class BearingModule {}
