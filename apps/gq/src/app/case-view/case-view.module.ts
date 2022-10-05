import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { PushModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';
import { ViewToggleModule } from '@schaeffler/view-toggle';

import { ConfirmationModalModule } from '../shared/components/modal/confirmation-modal/confirmation-modal.module';
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
    PushModule,
    ImportCaseModule,
    CreateManualCaseModule,
    ConfirmationModalModule,
    CommonModule,
    ViewToggleModule,
    SubheaderModule,
  ],
  providers: [
    { provide: TRANSLOCO_SCOPE, useValue: 'case-view' },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
  ],
})
export class CaseViewModule {}
