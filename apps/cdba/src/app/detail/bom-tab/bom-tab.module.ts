import { NgModule } from '@angular/core';

import { BomContainerModule } from '@cdba/shared/components';

import { BomTabComponent } from './bom-tab.component';
import { BomTabRoutingModule } from './bom-tab-routing.module';

@NgModule({
  declarations: [BomTabComponent],
  imports: [BomContainerModule, BomTabRoutingModule],
})
export class BomTabModule {}
