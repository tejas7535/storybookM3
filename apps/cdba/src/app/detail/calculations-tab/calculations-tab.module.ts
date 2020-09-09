import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculationsTableModule } from '../../shared/calculations-table/calculations-table.module';
import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [
    CommonModule,
    CalculationsTabRoutingModule,
    MatCardModule,
    SharedTranslocoModule,
    CalculationsTableModule,
  ],
})
export class CalculationsTabModule {}
