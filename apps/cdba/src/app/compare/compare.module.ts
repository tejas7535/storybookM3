import { NgModule } from '@angular/core';

import { PageHeaderModule, TabsHeaderModule } from '@cdba/shared/components';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CompareComponent } from './compare.component';
import { CompareRoutingModule } from './compare-routing.module';
import { CompareEffects } from './store/effects/compare.effects';
import { CompareFailureEffects } from './store/effects/compare-failure.effects';
import { compareReducer } from './store/reducers/compare.reducer';

@NgModule({
  declarations: [CompareComponent],
  imports: [
    ReactiveComponentModule,
    CompareRoutingModule,
    SharedTranslocoModule,
    StoreModule.forFeature('compare', compareReducer),
    EffectsModule.forFeature([CompareEffects, CompareFailureEffects]),
    PageHeaderModule,
    TabsHeaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'compare' }],
})
export class CompareModule {}
