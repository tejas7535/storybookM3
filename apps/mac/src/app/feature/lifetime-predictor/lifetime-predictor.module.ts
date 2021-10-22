import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule as NgrxStoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { InputModule } from './input/input.module';
import { LifetimePredictorRoutingModule } from './lifetime-predictor-routing.module';
import { LifetimePredictorComponent } from './lifetime-predictor.component';
import { PredictionModule } from './prediction/prediction.module';
import { InputEffects, PredictionEffects } from './store';
import { reducers } from './store/reducers';

@NgModule({
  declarations: [LifetimePredictorComponent],
  imports: [
    CommonModule,
    LifetimePredictorRoutingModule,
    ReactiveComponentModule,
    InputModule,
    PredictionModule,
    SharedTranslocoModule,
    NgrxStoreModule.forFeature('ltp', reducers),
    EffectsModule.forFeature([InputEffects, PredictionEffects]),
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
  ],
})
export class LifetimePredictorModule {}
