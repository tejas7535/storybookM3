import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { OfferTableModule } from '../offer-table/offer-table.module';
import { SharedModule } from '../shared.module';
import { OfferDrawerComponent } from './offer-drawer.component';

@NgModule({
  declarations: [OfferDrawerComponent],
  imports: [
    OfferTableModule,
    MatIconModule,
    MatButtonModule,
    SharedModule,
    SharedTranslocoModule,
  ],
  exports: [OfferDrawerComponent],
})
export class OfferDrawerModule {}
