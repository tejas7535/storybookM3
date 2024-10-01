import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AgGridModule } from 'ag-grid-angular';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../../shared/dialogs/employee-list-dialog/employee-list-dialog.module';
import { SharedModule } from '../../shared/shared.module';
import { LostJobProfilesComponent } from './lost-job-profiles.component';
import { OpenPositionsCellRendererComponent } from './open-positions-cell-renderer/open-positions-cell-renderer.component';

@NgModule({
  declarations: [LostJobProfilesComponent, OpenPositionsCellRendererComponent],
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
