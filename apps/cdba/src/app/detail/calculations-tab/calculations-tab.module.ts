import { NgModule } from '@angular/core';

import { CalculationsTableModule } from '@cdba/shared/components';
import { ReactiveComponentModule } from '@ngrx/component';

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
