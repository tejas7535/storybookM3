import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared';
import { AutocompleteInputModule } from '../shared/autocomplete-input/autocomplete-input.module';
import { LoadingSpinnerModule } from '../shared/loading-spinner/loading-spinner.module';
import { CaseTableModule } from './case-table/case-table.module';
import { CaseViewRoutingModule } from './case-view-routing.module';
import { CaseViewComponent } from './case-view.component';
import { CreateCaseDialogModule } from './create-case-dialog/create-case-dialog.module';
import { DeleteAcceptComponent } from './delete-accept/delete-accept.component';

@NgModule({
  declarations: [CaseViewComponent, DeleteAcceptComponent],
  imports: [
    AutocompleteInputModule,
    CaseTableModule,
    CaseViewRoutingModule,
    CommonModule,
    CreateCaseDialogModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    SharedModule,
    SharedTranslocoModule,
    LoadingSpinnerModule,
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: { disableClose: true, hasBackdrop: true },
    },
  ],
})
export class CaseViewModule {}
