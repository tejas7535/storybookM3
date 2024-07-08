import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { ApprovalModule } from '@gq/core/store/approval/approval.module';
import { CurrencyModule } from '@gq/core/store/currency/currency.module';
import { OverviewCasesModule } from '@gq/core/store/overview-cases/overview-cases.module';
import { ProcessCaseModule } from '@gq/core/store/process-case';
import { FPricingModule } from '@gq/f-pricing/f-pricing.module';
import { SharedQuotationButtonComponent } from '@gq/process-case-view/shared-quotation-button/shared-quotation-button.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { ExportExcelModalModule } from '@gq/shared/components/modal/export-excel-modal/export-excel-modal.module';
import { OfferTypeSelectComponent } from '@gq/shared/components/offer-type-select/offer-type-select.component';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { StatusCustomerInfoHeaderModule } from '../../app/shared/components/header/status-customer-info-header/status-customer-info-header.module';
import { TabsHeaderModule } from '../../app/shared/components/tabs-header/tabs-header.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
import { CancelWorkflowButtonComponent } from './cancel-workflow-button/cancel-workflow-button.component';
import { CancelWorkflowModalComponent } from './cancel-workflow-button/cancel-workflow-modal/cancel-workflow-modal.component';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ReleaseButtonComponent } from './release-button/release-button.component';
import { CalculationInProgressComponent } from './tabs/single-quotes-tab/calculation-in-progress/calculation-in-progress.component';
@NgModule({
  declarations: [
    ProcessCaseViewComponent,
    CalculationInProgressComponent,
    CancelWorkflowButtonComponent,
    CancelWorkflowModalComponent,
  ],
  imports: [
    ReleaseButtonComponent,
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    HeaderContentModule,
    ProcessCaseViewRoutingModule,
    SharedPipesModule,
    ProcessCaseModule,
    ApprovalModule,
    CurrencyModule,
    AddMaterialDialogModule,
    LoadingSpinnerModule,
    PushPipe,
    SharedTranslocoModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    ExportExcelModalModule,
    FormsModule,
    ReactiveFormsModule,
    OverviewCasesModule,
    SubheaderModule,
    TabsHeaderModule,
    StatusCustomerInfoHeaderModule,
    SharedDirectivesModule,
    DialogHeaderModule,
    FPricingModule,
    SharedQuotationButtonComponent,
    OfferTypeSelectComponent,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class ProcessCaseViewModule {}
