import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { OverviewCasesModule } from '@gq/core/store/overview-cases/overview-cases.module';
import { ConfirmationModalModule } from '@gq/shared/components/modal/confirmation-modal/confirmation-modal.module';
import { TRANSLOCO_SCOPE } from '@jsverse/transloco';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import { ImportCaseComponent } from './case-creation/import-case/import-case.component';
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
    LoadingSpinnerModule,
    PushPipe,
    ImportCaseComponent,
    ConfirmationModalModule,
    CommonModule,
    ViewToggleModule,
    SubheaderModule,
    OverviewCasesModule,
  ],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'case-view' }],
})
export class CaseViewModule {}
