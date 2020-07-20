import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DrawingsTabRoutingModule } from './drawings-tab-routing.module';
import { DrawingsTabComponent } from './drawings-tab.component';

@NgModule({
  declarations: [DrawingsTabComponent],
  imports: [CommonModule, DrawingsTabRoutingModule],
})
export class DrawingsTabModule {}
