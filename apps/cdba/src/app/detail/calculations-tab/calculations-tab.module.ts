import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

import { CalculationsTableModule } from '@cdba/shared/components';

import { CalculationsTabComponent } from './calculations-tab.component';
import { CalculationsTabRoutingModule } from './caluclations-tab-routing.module';

@NgModule({
  declarations: [CalculationsTabComponent],
  imports: [
    ReactiveComponentModule,
    CalculationsTabRoutingModule,
    CalculationsTableModule,
  ],
})
export class CalculationsTabModule {}
