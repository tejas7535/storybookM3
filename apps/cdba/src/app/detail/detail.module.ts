import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

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
    DetailRoutingModule,
    MatTabsModule,
    SharedTranslocoModule,
    StoreModule.forFeature('detail', detailReducer),
    MatIconModule,
    EffectsModule.forFeature([DetailEffects]),
    MaterialNumberModule,
  ],
})
export class DetailModule {}
