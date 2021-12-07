import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { BomContainerModule } from '@cdba/shared/components';

import { BomCompareTabComponent } from './bom-compare-tab.component';
import { BomCompareTabRoutingModule } from './bom-compare-tab-routing.module';

@NgModule({
  declarations: [BomCompareTabComponent],
  imports: [MatCardModule, BomCompareTabRoutingModule, BomContainerModule],
  exports: [BomCompareTabComponent],
})
export class BomCompareTabModule {}
