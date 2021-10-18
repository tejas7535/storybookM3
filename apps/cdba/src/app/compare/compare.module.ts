import { NgModule } from '@angular/core';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ShareButtonModule } from '@schaeffler/share-button';

import { SharedModule } from '@cdba/shared';
import { PageHeaderModule, TabsHeaderModule } from '@cdba/shared/components';

import { CompareRoutingModule } from './compare-routing.module';
import { CompareComponent } from './compare.component';
import { CompareEffects } from './store/effects/compare.effects';
import { compareReducer } from './store/reducers/compare.reducer';

@NgModule({
  declarations: [CompareComponent],
  imports: [
    SharedModule,
    CompareRoutingModule,
    SharedTranslocoModule,
    StoreModule.forFeature('compare', compareReducer),
    EffectsModule.forFeature([CompareEffects]),
    PageHeaderModule,
    TabsHeaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'compare' }],
})
export class CompareModule {}
