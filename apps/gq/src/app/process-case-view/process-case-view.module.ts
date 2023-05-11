import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';

import { ActiveCaseModule } from '@gq/core/store/active-case/active-case.module';
import { ApprovalModule } from '@gq/core/store/approval/approval.module';
import { ProcessCaseEffects } from '@gq/core/store/effects';
import { processCaseReducer } from '@gq/core/store/reducers/process-case/process-case.reducer';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { BreadcrumbsModule } from '@schaeffler/breadcrumbs';
import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { ShareButtonModule } from '@schaeffler/share-button';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SyncStatusCustomerInfoHeaderModule } from '../../app/shared/components/header/sync-status-customer-info-header/sync-status-customer-info-header.module';
import { TabsHeaderModule } from '../../app/shared/components/tabs-header/tabs-header.module';
import { ExportExcelModalModule } from '../shared/components/modal/export-excel-modal/export-excel-modal.module';
import { SharedPipesModule } from '../shared/pipes/shared-pipes.module';
import { AddMaterialDialogModule } from './add-material-dialog/add-material-dialog.module';
import { HeaderContentModule } from './header-content/header-content.module';
import { ProcessCaseViewComponent } from './process-case-view.component';
import { ProcessCaseViewRoutingModule } from './process-case-view-routing.module';
import { ReleaseButtonComponent } from './release-button/release-button.component';
import { ReleaseModalComponent } from './release-button/release-modal/release-modal.component';
import { ReleaseModalApproverSelectComponent } from './release-button/release-modal/release-modal-approver-select/release-modal-approver-select.component';
import { CalculationInProgressComponent } from './tabs/single-quotes-tab/calculation-in-progress/calculation-in-progress.component';
@NgModule({
  declarations: [
    ProcessCaseViewComponent,
    CalculationInProgressComponent,
    ReleaseButtonComponent,
    ReleaseModalComponent,
    ReleaseModalApproverSelectComponent,
  ],
  imports: [
    CommonModule,
    ScrollingModule,
    MatSidenavModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    HeaderContentModule,
    ProcessCaseViewRoutingModule,
    SharedPipesModule,
    ActiveCaseModule,
    StoreModule.forFeature('processCase', processCaseReducer),
    EffectsModule.forFeature([ProcessCaseEffects]),
    ApprovalModule,
    AddMaterialDialogModule,
    LoadingSpinnerModule,
    PushModule,
    SharedTranslocoModule,
    SubheaderModule,
    BreadcrumbsModule,
    ShareButtonModule,
    ExportExcelModalModule,
    MatTabsModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,

    SubheaderModule,
    TabsHeaderModule,
    SyncStatusCustomerInfoHeaderModule,
    SharedDirectivesModule,
    DialogHeaderModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class ProcessCaseViewModule {}
