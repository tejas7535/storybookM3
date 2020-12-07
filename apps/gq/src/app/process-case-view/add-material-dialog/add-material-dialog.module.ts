import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { AddEntryModule } from './add-entry/add-entry.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';
import { AddMaterialInputTableModule } from './add-material-input-table/add-material-input-table.module';

@NgModule({
  declarations: [AddMaterialDialogComponent],
  imports: [
    AddMaterialInputTableModule,
    MatCardModule,
    MatDialogModule,
    AddEntryModule,
    SharedModule,
    SharedTranslocoModule,
    MatIconModule,
  ],
  exports: [AddMaterialDialogComponent],
})
export class AddMaterialDialogModule {}
