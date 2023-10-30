import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';
import { LostJobProfilesComponent } from './lost-job-profiles.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [LostJobProfilesComponent, AmountCellRendererComponent],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    AgGridModule,
    EmployeeListDialogModule,
    SharedTranslocoModule,
  ],
  exports: [LostJobProfilesComponent],
})
export class LostJobProfilesModule {}
