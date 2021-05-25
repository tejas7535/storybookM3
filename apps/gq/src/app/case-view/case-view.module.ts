import { NgModule } from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';
import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { CreateManualCaseModule } from './case-creation/create-manual-case/create-manual-case.module';
import { ImportCaseModule } from './case-creation/import-case/import-case.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewRoutingModule } from './case-view-routing.module';
import { CaseViewComponent } from './case-view.component';
import { DeleteAcceptComponent } from './delete-accept/delete-accept.component';

@NgModule({
  declarations: [CaseViewComponent, DeleteAcceptComponent],
  imports: [
    CaseTableModule,
    CaseViewRoutingModule,
    MatDialogModule,
    SharedModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
    ReactiveComponentModule,
    ImportCaseModule,
    CreateManualCaseModule,
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
