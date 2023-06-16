import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';

import { OverviewCasesModule } from '@gq/core/store/overview-cases/overview-cases.module';
import { ConfirmationModalModule } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.module';
import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import { CreateCustomerCaseModule } from './case-creation/create-customer-case/create-customer-case.module';
import { CreateManualCaseModule } from './case-creation/create-manual-case/create-manual-case.module';
import { ImportCaseModule } from './case-creation/import-case/import-case.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewComponent } from './case-view.component';
import { CaseViewRoutingModule } from './case-view-routing.module';
@NgModule({
  declarations: [CaseViewComponent],
  imports: [
    CaseTableModule,
    CaseViewRoutingModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
    CreateCustomerCaseModule,
    LoadingSpinnerModule,
    PushPipe,
    ImportCaseModule,
    CreateManualCaseModule,
    ConfirmationModalModule,
    CommonModule,
    ViewToggleModule,
    SubheaderModule,
    OverviewCasesModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'case-view' }],
})
export class CaseViewModule {}
