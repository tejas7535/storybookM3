import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { TRANSLOCO_SCOPE } from '@ngneat/transloco';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared';
import { AddEntryModule } from '../../shared/case-material/add-entry/add-entry.module';
import { InputTableModule } from '../../shared/case-material/input-table/input-table.module';
import { AddMaterialDialogComponent } from './add-material-dialog.component';

@NgModule({
  declarations: [AddMaterialDialogComponent],
  imports: [
    InputTableModule,
    MatCardModule,
    MatDialogModule,
    AddEntryModule,
    SharedModule,
    SharedTranslocoModule,
    MatIconModule,
  ],
  exports: [AddMaterialDialogComponent],
  providers: [{ provide: TRANSLOCO_SCOPE, useValue: 'process-case-view' }],
})
export class AddMaterialDialogModule {}
