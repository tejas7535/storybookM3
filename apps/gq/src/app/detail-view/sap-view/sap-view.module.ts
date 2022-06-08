import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CustomerHeaderModule } from '../../shared/components/header/customer-header/customer-header.module';
import { MaterialPriceHeaderContentModule } from '../../shared/components/header/material-price-header-content/material-price-header-content.module';
import { SapPriceDetailsTableModule } from './sap-price-details-table/sap-price-details-table.module';
import { SapViewComponent } from './sap-view.component';
import { SapViewRoutingModule } from './sap-view-routing.module';

@NgModule({
  declarations: [SapViewComponent],
  imports: [
    CommonModule,
    SapViewRoutingModule,
    MatCardModule,
    SharedTranslocoModule,
    SubheaderModule,
    CustomerHeaderModule,
    PushModule,
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
