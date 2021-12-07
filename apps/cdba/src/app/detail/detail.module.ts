import { NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

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
import { MaterialNumberModule } from '../shared/pipes/material-number/material-number.module';
import { DetailComponent } from './detail.component';
import { DetailRoutingModule } from './detail-routing.module';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    ReactiveComponentModule,
    SharedTranslocoModule,
    DetailRoutingModule,
    StoreModule.forFeature('detail', detailReducer),
    EffectsModule.forFeature([DetailEffects, DetailFailureEffects]),
    MatSnackBarModule,
    MaterialNumberModule,
    PageHeaderModule,
    TabsHeaderModule,
    ShareButtonModule,
    BreadcrumbsModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail' }],
})
export class DetailModule {}
