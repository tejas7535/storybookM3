import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { CalculationsTableModule } from '@cdba/shared/components';

import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [PushPipe, CalculationsTabRoutingModule, CalculationsTableModule],
})
export class CalculationsTabModule {}
