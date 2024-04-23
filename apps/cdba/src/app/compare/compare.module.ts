import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { TabsHeaderModule } from '@cdba/shared/components';

import { CompareComponent } from './compare.component';
import { CompareRoutingModule } from './compare-routing.module';
import {
  BomEffects,
  CalculationsEffects,
  ProductDetailsEffects,
} from './store/effects';
import { FailureEffects } from './store/effects/failure.effects';
import { compareReducer } from './store/reducers/compare.reducer';

@NgModule({
  declarations: [CompareComponent],
  imports: [
    PushPipe,
    CompareRoutingModule,
    SharedTranslocoModule,
    StoreModule.forFeature('compare', compareReducer),
    EffectsModule.forFeature([
      BomEffects,
      CalculationsEffects,
      ProductDetailsEffects,
      FailureEffects,
    ]),
    SubheaderModule,
    TabsHeaderModule,
    ShareButtonModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'compare' }],
})
export class CompareModule {}
