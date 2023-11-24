import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { ApprovalModule } from '@gq/core/store/approval/approval.module';
import { RfqDataModule } from '@gq/core/store/rfq-data/rfq-data.module';
import { StatusCustomerInfoHeaderModule } from '@gq/shared/components/header/status-customer-info-header/status-customer-info-header.module';
import { EditingModalModule } from '@gq/shared/components/modal/editing-modal/editing-modal.module';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

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
    LetDirective,
    PushPipe,
    SharedPipesModule,
    PricingDetailsModule,
    LoadingSpinnerModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    CommonModule,
    StatusCustomerInfoHeaderModule,
    SharedTranslocoModule,
    MatTooltipModule,
    ActiveCaseModule,
    EditingModalModule,
    ApprovalModule,
    SharedDirectivesModule,
    RfqDataModule,
  ],
})
export class DetailViewModule {}
