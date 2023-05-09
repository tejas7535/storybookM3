import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { LetModule, PushModule } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SyncStatusCustomerInfoHeaderModule } from '../../shared/components/header/sync-status-customer-info-header/sync-status-customer-info-header.module';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';
import { DetailViewComponent } from './detail-view.component';
import { DetailViewHeaderContentModule } from './detail-view-header-content/detail-view-header-content.module';
import { DetailViewNavigationBarModule } from './detail-view-navigation-bar/detail-view-navigation-bar.module';
import { DetailViewRoutingModule } from './detail-view-routing.module';
import { FilterPricingModule } from './filter-pricing/filter-pricing.module';
import { PricingDetailsModule } from './pricing-details/pricing-details.module';

@NgModule({
  declarations: [DetailViewComponent],
  imports: [
    DetailViewRoutingModule,
    DetailViewHeaderContentModule,
    DetailViewNavigationBarModule,
    FilterPricingModule,
    MatButtonModule,
    MatSidenavModule,
    ReactiveFormsModule,
    LetModule,
    PushModule,
    SharedPipesModule,
    PricingDetailsModule,
    LoadingSpinnerModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    CommonModule,
    SyncStatusCustomerInfoHeaderModule,
    SharedTranslocoModule,
    MatTooltipModule,
    ActiveCaseModule,
  ],
})
export class DetailViewModule {}
