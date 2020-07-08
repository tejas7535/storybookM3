import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ThingEffects } from '../core/store/effects/thing/thing.effects';
import { thingReducer } from '../core/store/reducers/thing/thing.reducer';
import { OverviewRoutingModule } from './overview-routing.module';
import { OverviewComponent } from './overview.component';

@NgModule({
  declarations: [OverviewComponent],
  imports: [
    CommonModule,
    OverviewRoutingModule,

    // UI Modules
    FlexLayoutModule,
    MatButtonModule,
    MatCardModule,

    // Translation
    SharedTranslocoModule,

    // Store
    StoreModule.forFeature('thing', thingReducer),
    EffectsModule.forFeature([ThingEffects]),
  ],
})
export class OverviewModule {}
