import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';

import { MaterialPriceHeaderContentModule } from '@gq/shared/components/header/material-price-header-content/material-price-header-content.module';
import { SyncStatusCustomerInfoHeaderModule } from '@gq/shared/components/header/sync-status-customer-info-header/sync-status-customer-info-header.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    PushPipe,
    ShareButtonModule,
    MaterialPriceHeaderContentModule,
    LoadingSpinnerModule,
    SapPriceDetailsTableModule,
    SyncStatusCustomerInfoHeaderModule,
  ],
  providers: [
    {
      provide: TRANSLOCO_SCOPE,
      useValue: 'sap-view',
    },
  ],
})
export class SapViewModule {}
