import { NgModule } from '@angular/core';

import { SharedModule } from '@cdba/shared';
import { BomTableModule } from '@cdba/shared/components';

import { BomCompareTabRoutingModule } from './bom-compare-tab-routing.module';
import { BomCompareTabComponent } from './bom-compare-tab.component';

@NgModule({
  declarations: [BomCompareTabComponent],
  imports: [SharedModule, BomCompareTabRoutingModule, BomTableModule],
  exports: [BomCompareTabComponent],
})
export class BomCompareTabModule {}
