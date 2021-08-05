import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';

import { SharedModule } from '../shared/shared.module';
import { ReasonsAndCounterMeasuresRoutingModule } from './reasons-and-counter-measures-routing.module';
import { ReasonsAndCounterMeasuresComponent } from './reasons-and-counter-measures.component';
import { ReasonsForLeavingModule } from './reasons-for-leaving/reasons-for-leaving.module';
import * as fromReasonsAndCounterMeasures from './store';

@NgModule({
  declarations: [ReasonsAndCounterMeasuresComponent],
  imports: [
    SharedModule,
    ReasonsAndCounterMeasuresRoutingModule,
    StoreModule.forFeature(
      fromReasonsAndCounterMeasures.reasonsAndCounterMeasuresFeatureKey,
      fromReasonsAndCounterMeasures.reducer
    ),
    ReasonsForLeavingModule,
  ],
})
export class ReasonsAndCounterMeasuresModule {}
