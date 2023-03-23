import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';
import { LostJobProfilesComponent } from './lost-job-profiles.component';

@NgModule({
  declarations: [LostJobProfilesComponent, AmountCellRendererComponent],
  imports: [
    SharedModule,
    MatIconModule,
    MatButtonModule,
    AgGridModule,
    EmployeeListDialogModule,
    MatTooltipModule,
    SharedTranslocoModule,
  ],
  exports: [LostJobProfilesComponent],
})
export class LostJobProfilesModule {}
