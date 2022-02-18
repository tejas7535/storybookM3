import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PageHeaderModule, TabsHeaderModule } from '@cdba/shared/components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { DetailEffects } from '../core/store/effects/detail/detail.effects';
import { DetailFailureEffects } from '../core/store/effects/detail/detail-failure.effects';
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
    EffectsModule.forFeature([DetailEffects, DetailFailureEffects]),
    MaterialNumberModule,
    PageHeaderModule,
    TabsHeaderModule,
    ShareButtonModule,
    BreadcrumbsModule,
    PcmBadgeModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail' }],
})
export class DetailModule {}
