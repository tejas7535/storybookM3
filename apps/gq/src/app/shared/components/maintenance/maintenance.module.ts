import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { MaintenanceComponent } from './maintenance.component';

@NgModule({
  declarations: [MaintenanceComponent],
  imports: [CommonModule, SharedTranslocoModule],
  exports: [MaintenanceComponent],
})
export class MaintenanceModule {}
