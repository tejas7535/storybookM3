import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { CalculatorLogoModule } from '@ga/shared/components/calculator-logo';

import { HomepageCardComponent } from './homepage-card.component';

@NgModule({
  declarations: [HomepageCardComponent],
  imports: [CommonModule, SharedTranslocoModule, CalculatorLogoModule],
  exports: [HomepageCardComponent],
})
export class HomepageCardModule {}
