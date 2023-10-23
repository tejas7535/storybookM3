import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculatorLogoComponent } from './calculator-logo.component';

@NgModule({
  declarations: [CalculatorLogoComponent],
  imports: [CommonModule, SharedTranslocoModule],
  exports: [CalculatorLogoComponent],
})
export class CalculatorLogoModule {}
