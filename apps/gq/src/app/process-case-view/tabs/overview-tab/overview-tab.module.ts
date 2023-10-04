import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

import { UserSelectComponent } from '@gq/process-case-view/user-select/user-select.component';
import { AttachmentFilesModule } from '@gq/shared/components/attachment-files/attachment-files.module';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { HorizontalDividerModule } from '@gq/shared/components/horizontal-divider/horizontal-divider.module';
import { KpiStatusCardComponent } from '@gq/shared/components/kpi-status-card/kpi-status-card.component';
import { LabelTextModule } from '@gq/shared/components/label-text/label-text.module';
import { AttachmentFilesUploadModalModule } from '@gq/shared/components/modal/attachment-files-upload-modal/attachment-files-upload-modal.module';
import { DeletingAttachmentModalModule } from '@gq/shared/components/modal/delete-attachment-modal/delete-attachment-modal.module';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { LetDirective, PushPipe } from '@ngrx/component';
import * as echarts from 'echarts';
import { NgxEchartsModule } from 'ngx-echarts';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  ApprovalCockpitComponent,
  ApprovalWorkflowApproverComponent,
  GeneralInformationComponent,
  QuotationByProductLineOrGpsdBarChartComponent,
  QuotationByProductLineOrGpsdComponent,
  QuotationRatingComponent,
} from './components';
import { ApproverDisplayPipe } from './components/approval-cockpit/approval-workflow-approver/pipes/approver-display.pipe';
import { UserInitialLettersPipe } from './components/approval-cockpit/approval-workflow-approver/pipes/user-initial-letters.pipe';
import { ApprovalWorkflowHistoryComponent } from './components/approval-cockpit/approval-workflow-history/approval-workflow-history.component';
import { ApprovalWorkflowHistoryIterationsComponent } from './components/approval-cockpit/approval-workflow-history/approval-workflow-history-iterations/approval-workflow-history-iterations.component';
import { ApprovalWorkflowHistorySectionComponent } from './components/approval-cockpit/approval-workflow-history/approval-workflow-history-section/approval-workflow-history-section.component';
import { ApprovalDecisionModalComponent } from './components/approval-decision-modal/approval-decision-modal.component';
import { ForwardApprovalWorkflowModalComponent } from './components/forward-approval-workflow-modal/forward-approval-workflow-modal.component';
import { OverviewTabComponent } from './overview-tab.component';
import { OverviewTabRoutingModule } from './overview-tab.routing.module';

@NgModule({
  imports: [
    CommonModule,
    NgxEchartsModule.forRoot({
      echarts,
    }),
    OverviewTabRoutingModule,
    SharedTranslocoModule,
    KpiStatusCardComponent,
    LabelTextModule,
    HorizontalDividerModule,
    MatIconModule,
    SharedPipesModule,
    PushPipe,
    MatCardModule,
    MatSelectModule,
    DialogHeaderModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    LoadingSpinnerModule,
    UserSelectComponent,
    LetDirective,
    AttachmentFilesModule,
    AttachmentFilesUploadModalModule,
    DeletingAttachmentModalModule,
    SharedDirectivesModule,
  ],
  declarations: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineOrGpsdComponent,
    QuotationByProductLineOrGpsdBarChartComponent,
    ApprovalCockpitComponent,
    ApprovalWorkflowApproverComponent,
    ApprovalWorkflowHistoryComponent,
    ApprovalWorkflowHistoryIterationsComponent,
    ApprovalWorkflowHistorySectionComponent,
    ApprovalDecisionModalComponent,
    ForwardApprovalWorkflowModalComponent,
    UserInitialLettersPipe,
    ApproverDisplayPipe,
  ],
  exports: [
    OverviewTabComponent,
    GeneralInformationComponent,
    QuotationRatingComponent,
    QuotationByProductLineOrGpsdComponent,
    QuotationByProductLineOrGpsdBarChartComponent,
  ],
})
export class OverviewTabModule {}
