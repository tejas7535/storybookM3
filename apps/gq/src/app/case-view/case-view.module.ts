import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared';
import { ConfirmationModalModule } from '../shared/confirmation-modal/confirmation-modal.module';
import { CreateCustomerCaseModule } from './case-creation/create-customer-case/create-customer-case.module';
import { CreateManualCaseModule } from './case-creation/create-manual-case/create-manual-case.module';
import { ImportCaseModule } from './case-creation/import-case/import-case.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewRoutingModule } from './case-view-routing.module';
import { CaseViewComponent } from './case-view.component';

@NgModule({
  declarations: [CaseViewComponent],
  imports: [
    CaseTableModule,
    CaseViewRoutingModule,
    MatDialogModule,
    SharedModule,
    MatButtonModule,
    SharedTranslocoModule,
    CreateCustomerCaseModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    ImportCaseModule,
    CreateManualCaseModule,
    ConfirmationModalModule,
    MatCardModule,
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
