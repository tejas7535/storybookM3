import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BomTabRoutingModule } from './bom-tab-routing.module';
import { BomTabComponent } from './bom-tab.component';

@NgModule({
  declarations: [BomTabComponent],
  imports: [CommonModule, BomTabRoutingModule],
})
export class BomTabModule {}
