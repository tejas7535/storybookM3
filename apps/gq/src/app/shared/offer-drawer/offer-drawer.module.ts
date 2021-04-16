import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LoadingSpinnerModule } from '../loading-spinner/loading-spinner.module';
import { OfferTableModule } from '../offer-table/offer-table.module';
import { SharedModule } from '../shared.module';
import { OfferDrawerComponent } from './offer-drawer.component';

@NgModule({
  declarations: [OfferDrawerComponent],
  imports: [
    OfferTableModule,
    LoadingSpinnerModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    SharedTranslocoModule,
    ReactiveComponentModule,
  ],
  exports: [OfferDrawerComponent],
})
export class OfferDrawerModule {}
