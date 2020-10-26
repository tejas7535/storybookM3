import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CaseViewRoutingModule } from './case-view-routing.module';
import { CaseViewComponent } from './case-view.component';
import { AutocompleteInputModule } from './create-case-dialog/autocomplete-input/autocomplete-input.module';
import { CreateCaseDialogModule } from './create-case-dialog/create-case-dialog.module';

@NgModule({
  declarations: [CaseViewComponent],
  imports: [
    AutocompleteInputModule,
    CreateCaseDialogModule,
    CommonModule,
    CaseViewRoutingModule,
    MatDialogModule,
    SharedTranslocoModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
  ],
})
export class CaseViewModule {}
