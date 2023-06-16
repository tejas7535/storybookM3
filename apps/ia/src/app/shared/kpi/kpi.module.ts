import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { LoadingSpinnerModule } from '@schaeffler/loading-spinner';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { EmployeeListDialogModule } from '../dialogs/employee-list-dialog/employee-list-dialog.module';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { KpiComponent } from './kpi.component';

@NgModule({
  declarations: [KpiComponent],
  imports: [
    CommonModule,
    MatIconModule,
    EmployeeListDialogModule,
    LoadingSpinnerModule,
    MatTooltipModule,
    SharedTranslocoModule,
    SharedPipesModule,
  ],
  exports: [KpiComponent],
})
export class KpiModule {}
