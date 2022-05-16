import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  BomEffects,
  CalculationsEffects,
  DrawingsEffects,
  ProductDetailsEffects,
} from '@cdba/core/store/effects/detail';
import { TabsHeaderModule } from '@cdba/shared/components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { FailureEffects } from '../core/store/effects/detail/failure.effects';
import { detailReducer } from '../core/store/reducers/detail/detail.reducer';
import { PcmBadgeModule } from '../shared/components/pcm-badge';
import { MaterialNumberModule } from '../shared/pipes/material-number/material-number.module';
import { DetailComponent } from './detail.component';
import { DetailRoutingModule } from './detail-routing.module';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,
    SharedTranslocoModule,
    DetailRoutingModule,
    StoreModule.forFeature('detail', detailReducer),
    EffectsModule.forFeature([
      BomEffects,
      CalculationsEffects,
      DrawingsEffects,
      ProductDetailsEffects,
      FailureEffects,
    ]),
    MaterialNumberModule,
    TabsHeaderModule,
    ShareButtonModule,
    SubheaderModule,
    PcmBadgeModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail' }],
})
export class DetailModule {}
