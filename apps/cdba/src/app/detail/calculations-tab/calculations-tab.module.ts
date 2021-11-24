import { NgModule } from '@angular/core';

import { SharedModule } from '@cdba/shared';
import { CalculationsTableModule } from '@cdba/shared/components';

import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [
    SharedModule,
    CalculationsTabRoutingModule,
    CalculationsTableModule,
  ],
})
export class CalculationsTabModule {}
