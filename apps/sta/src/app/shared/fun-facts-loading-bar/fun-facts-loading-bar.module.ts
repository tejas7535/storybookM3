import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { FunFactsLoadingBarComponent } from './fun-facts-loading-bar.component';

@NgModule({
  declarations: [FunFactsLoadingBarComponent],
  imports: [CommonModule, MatProgressBarModule],
  exports: [FunFactsLoadingBarComponent]
})
export class FunFactsLoadingBarModule {}
