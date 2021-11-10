import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaterialPriceHeaderContentModule } from '../../shared/components/material-price-header-content/material-price-header-content.module';
import { CustomerHeaderModule } from '../../shared/header/customer-header/customer-header.module';
import { SapPriceDetailsTableModule } from './sap-price-details-table/sap-price-details-table.module';
import { SapViewRoutingModule } from './sap-view-routing.module';
import { SapViewComponent } from './sap-view.component';

@NgModule({
  declarations: [SapViewComponent],
  imports: [
    CommonModule,
    SapViewRoutingModule,
    MatCardModule,
    SharedTranslocoModule,
    SubheaderModule,
    CustomerHeaderModule,
    ReactiveComponentModule,
    ShareButtonModule,
    MaterialPriceHeaderContentModule,
    LoadingSpinnerModule,
    SapPriceDetailsTableModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'sap-view',
    },
  ],
})
export class SapViewModule {}
