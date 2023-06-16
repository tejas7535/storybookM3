import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PushPipe } from '@ngrx/component';

import { ToggleSplitTypeButtonModule } from '../../button/toggle-split-type-button/toggle-split-type-button.module';
import { CostElementsStatusBarComponent } from './cost-elements-status-bar.component';

@NgModule({
  declarations: [CostElementsStatusBarComponent],
  imports: [CommonModule, PushPipe, ToggleSplitTypeButtonModule],
})
export class CostElementsStatusBarModule {}
