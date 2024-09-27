import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AutocompleteInputComponent } from '@gq/shared/components/autocomplete-input/autocomplete-input.component';
import { AddEntryComponent } from '@gq/shared/components/case-material/add-entry/add-entry.component';
import { InputTableComponent } from '@gq/shared/components/case-material/input-table/input-table.component';
import { DialogHeaderModule } from '@gq/shared/components/header/dialog-header/dialog-header.module';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { PushPipe } from '@ngrx/component';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { AddMaterialDialogComponent } from './add-material-dialog.component';

@NgModule({
  declarations: [AddMaterialDialogComponent],
  imports: [
    AutocompleteInputComponent,
    AddEntryComponent,
    InputTableComponent,
    MatCardModule,
    MatDialogModule,
    MatIconModule,
    LoadingSpinnerModule,
    PushPipe,
    SharedTranslocoModule,
    CommonModule,
    SharedDirectivesModule,
    DialogHeaderModule,
  ],
  exports: [AddMaterialDialogComponent],
})
export class AddMaterialDialogModule {}
