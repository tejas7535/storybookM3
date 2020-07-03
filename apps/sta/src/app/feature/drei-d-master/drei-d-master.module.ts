import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';

import { TextInputModule } from '../../shared/text-input/text-input.module';
import { DreiDMasterRoutingModule } from './drei-d-master-routing.module';
import { DreiDMasterComponent } from './drei-d-master.component';

@NgModule({
  declarations: [DreiDMasterComponent],
  imports: [
    CommonModule,
    DreiDMasterRoutingModule,
    TextInputModule,
    MatTabsModule,
  ],
  exports: [DreiDMasterRoutingModule],
})
export class DreiDMasterModule {}
