import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [CommonModule, CalculationsTabRoutingModule],
})
export class CalculationsTabModule {}
