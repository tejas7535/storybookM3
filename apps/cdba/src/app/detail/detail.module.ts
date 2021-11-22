import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { PageHeaderModule, TabsHeaderModule } from '@cdba/shared/components';

import { DetailEffects } from '../core/store/effects/detail/detail.effects';
import { DetailFailureEffects } from '../core/store/effects/detail/detail-failure.effects';
import { detailReducer } from '../core/store/reducers/detail/detail.reducer';
import { SharedModule } from '../shared/shared.module';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';
import { ShareButtonModule } from '@schaeffler/share-button';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    DetailRoutingModule,
    StoreModule.forFeature('detail', detailReducer),
    EffectsModule.forFeature([DetailEffects, DetailFailureEffects]),
    MatSnackBarModule,
    PageHeaderModule,
    TabsHeaderModule,
    ShareButtonModule,
    BreadcrumbsModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail' }],
})
export class DetailModule {}
