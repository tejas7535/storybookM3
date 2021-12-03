import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { BomContainerModule } from '@cdba/shared/components';

import { BomCompareTabRoutingModule } from './bom-compare-tab-routing.module';
import { BomCompareTabComponent } from './bom-compare-tab.component';

@NgModule({
  declarations: [BomCompareTabComponent],
  imports: [MatCardModule, BomCompareTabRoutingModule, BomContainerModule],
  exports: [BomCompareTabComponent],
})
export class BomCompareTabModule {}
