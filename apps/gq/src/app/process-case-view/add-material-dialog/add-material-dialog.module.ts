import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { PushModule } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AutocompleteInputModule } from '../../shared/components/autocomplete-input/autocomplete-input.module';
import { AddEntryModule } from '../../shared/components/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/components/case-material/input-table/input-table.module';
import { SharedDirectivesModule } from '../../shared/directives/shared-directives.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';

@NgModule({
  declarations: [AddMaterialDialogComponent],
  imports: [
    AutocompleteInputModule,
    AddEntryModule,
    InputTableModule,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    LoadingSpinnerModule,
    PushModule,
    SharedTranslocoModule,
    CommonModule,
    SharedDirectivesModule,
  ],
  exports: [AddMaterialDialogComponent],
})
export class AddMaterialDialogModule {}
