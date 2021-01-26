import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AgGridModule } from '@ag-grid-community/angular';

import { LostJobProfilesComponent } from './lost-job-profiles.component';

@NgModule({
  declarations: [LostJobProfilesComponent],
  imports: [CommonModule, AgGridModule],
  exports: [LostJobProfilesComponent],
})
export class LostJobProfilesModule {}
