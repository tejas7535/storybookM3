import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { IconsModule } from '@schaeffler/icons';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../../shared/shared.module';
import { TerminatedEmployeesDialogComponent } from './terminated-employees-dialog.component';

@NgModule({
  declarations: [TerminatedEmployeesDialogComponent],
  imports: [
    SharedModule,
    MatDialogModule,
    MatButtonModule,
    MatDividerModule,
    MatListModule,
    IconsModule,
    MatIconModule,
    SharedTranslocoModule,
  ],
  exports: [TerminatedEmployeesDialogComponent],
})
export class TerminatedEmployeesDialogModule {}
