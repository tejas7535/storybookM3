import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { ExcludedCalculationsModule } from '@cdba/shared/components/excluded-calculations';
import { InViewModule } from '@cdba/shared/directives/in-view';

import { CompareButtonModule } from '../../button/compare-button';
import { LoadBomButtonModule } from '../../button/load-bom-button';
import { CalculationsStatusBarComponent } from './calculations-status-bar.component';

@NgModule({
  declarations: [CalculationsStatusBarComponent],
  imports: [
    PushPipe,
    InViewModule,
    LoadBomButtonModule,
    CompareButtonModule,
    ExcludedCalculationsModule,
  ],
  exports: [CalculationsStatusBarComponent],
})
export class CalculationsStatusBarModule {}
