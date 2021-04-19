import { NgModule } from '@angular/core';

import { SharedModule } from '@cdba/shared';
import { BomContainerModule } from '@cdba/shared/components';

import { BomTabRoutingModule } from './bom-tab-routing.module';
import { BomTabComponent } from './bom-tab.component';

@NgModule({
  declarations: [BomTabComponent],
  imports: [SharedModule, BomContainerModule, BomTabRoutingModule],
})
export class BomTabModule {}
