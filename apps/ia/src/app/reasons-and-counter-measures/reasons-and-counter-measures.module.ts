import { NgModule } from '@angular/core';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { ReasonsAndCounterMeasuresComponent } from './reasons-and-counter-measures.component';
import { ReasonsAndCounterMeasuresRoutingModule } from './reasons-and-counter-measures-routing.module';
import { ReasonsForLeavingModule } from './reasons-for-leaving/reasons-for-leaving.module';
import * as fromReasonsAndCounterMeasures from './store';
import { ReasonsAndCounterMeasuresEffects } from './store/effects/reasons-and-counter-measures.effects';

@NgModule({
  declarations: [ReasonsAndCounterMeasuresComponent],
  imports: [
    SharedModule,
    ReasonsAndCounterMeasuresRoutingModule,
    StoreModule.forFeature(
      fromReasonsAndCounterMeasures.reasonsAndCounterMeasuresFeatureKey,
      fromReasonsAndCounterMeasures.reducer
    ),
    EffectsModule.forFeature([ReasonsAndCounterMeasuresEffects]),
    ReasonsForLeavingModule,
  ],
})
export class ReasonsAndCounterMeasuresModule {}
