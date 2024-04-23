import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// eslint-disable-next-line @nx/enforce-module-boundaries
import { UnderConstructionModule } from '@schaeffler/empty-states';

import { RiskOfLeavingComponent } from './risk-of-leaving.component';

@NgModule({
  declarations: [RiskOfLeavingComponent],
  imports: [CommonModule, UnderConstructionModule],
  exports: [RiskOfLeavingComponent],
})
export class RiskOfLeavingModule {}
