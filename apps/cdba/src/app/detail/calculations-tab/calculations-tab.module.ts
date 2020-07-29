import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BlockUiModule } from '../../shared/block-ui/block-ui.module';
import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTableModule } from './calculations-table/calculations-table.module';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [
    CommonModule,
    CalculationsTabRoutingModule,
    CalculationsTableModule,
    BlockUiModule,
  ],
})
export class CalculationsTabModule {}
