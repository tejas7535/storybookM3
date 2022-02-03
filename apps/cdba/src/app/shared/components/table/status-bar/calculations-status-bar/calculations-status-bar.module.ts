import { NgModule } from '@angular/core';

import { ExcludedCalculationsModule } from '@cdba/shared/components/excluded-calculations';
import { InViewModule } from '@cdba/shared/directives/in-view';
import { ReactiveComponentModule } from '@ngrx/component';

import { CompareButtonModule } from '../../button/compare-button';
import { LoadBomButtonModule } from '../../button/load-bom-button';
import { CalculationsStatusBarComponent } from './calculations-status-bar.component';

@NgModule({
  declarations: [CalculationsStatusBarComponent],
  imports: [
    ReactiveComponentModule,
    InViewModule,
    LoadBomButtonModule,
    CompareButtonModule,
    ExcludedCalculationsModule,
  ],
  exports: [CalculationsStatusBarComponent],
})
export class CalculationsStatusBarModule {}
