import { ScrollingModule } from '@angular/cdk/scrolling';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';

@NgModule({
  declarations: [EmployeeListDialogComponent],
  entryComponents: [EmployeeListDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    SharedTranslocoModule,
    ScrollingModule,
  ],
  exports: [EmployeeListDialogComponent],
})
export class EmployeeListDialogModule {}
