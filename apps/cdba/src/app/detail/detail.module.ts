import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { StoreModule } from '@ngrx/store';

import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    MatCardModule,
  ],
})
export class DetailModule {}
