import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { SnackBarModule } from '@schaeffler/snackbar';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialNumberModule } from '@cdba/shared';

import { DetailEffects } from '../core/store/effects/detail/detail.effects';
import { detailReducer } from '../core/store/reducers/detail/detail.reducer';
import { SharedModule } from '../shared/shared.module';
import { DetailRoutingModule } from './detail-routing.module';
import { DetailComponent } from './detail.component';

@NgModule({
  declarations: [DetailComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    DetailRoutingModule,
    MatTabsModule,
    StoreModule.forFeature('detail', detailReducer),
    MatIconModule,
    EffectsModule.forFeature([DetailEffects]),
    MaterialNumberModule,
    SnackBarModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'detail' }],
})
export class DetailModule {}
