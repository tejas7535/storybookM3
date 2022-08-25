import { NgModule } from '@angular/core';

import { PushModule } from '@ngrx/component';

import { CalculationsTableModule } from '@cdba/shared/components';

import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [PushModule, CalculationsTabRoutingModule, CalculationsTableModule],
})
export class CalculationsTabModule {}
