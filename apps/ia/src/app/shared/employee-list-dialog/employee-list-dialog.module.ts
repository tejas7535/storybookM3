import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../shared.module';
import { EmployeeListDialogComponent } from './employee-list-dialog.component';

@NgModule({
  declarations: [EmployeeListDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    SharedTranslocoModule,
  ],
  exports: [EmployeeListDialogComponent, MatDialogModule],
})
export class EmployeeListDialogModule {}
