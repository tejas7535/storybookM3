import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AgGridModule } from '@ag-grid-community/angular';

import { IconsModule } from '@schaeffler/icons';

import { EmployeeListDialogModule } from '../../shared/employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { AmountCellRendererComponent } from './amount-cell-renderer/amount-cell-renderer.component';
import { LostJobProfilesComponent } from './lost-job-profiles.component';

@NgModule({
  declarations: [LostJobProfilesComponent, AmountCellRendererComponent],
  imports: [
    SharedModule,
    MatIconModule,
    IconsModule,
    MatButtonModule,
    AgGridModule.withComponents([AmountCellRendererComponent]),
    EmployeeListDialogModule,
  ],
  exports: [LostJobProfilesComponent],
})
export class LostJobProfilesModule {}
