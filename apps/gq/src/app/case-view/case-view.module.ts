import { NgModule } from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';

import { SharedModule } from '../shared/shared.module';
import { CaseViewRoutingModule } from './case-view-routing.module';
import { CaseViewComponent } from './case-view.component';
import { CreateCaseDialogComponent } from './create-case-dialog/create-case-dialog.component';

@NgModule({
  declarations: [CaseViewComponent, CreateCaseDialogComponent],
  imports: [CaseViewRoutingModule, MatDialogModule, SharedModule],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
  ],
})
export class CaseViewModule {}
