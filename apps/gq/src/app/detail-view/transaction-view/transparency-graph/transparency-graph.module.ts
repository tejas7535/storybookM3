import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { TransparencyGraphComponent } from './transparency-graph.component';

@NgModule({
  declarations: [TransparencyGraphComponent],
  imports: [CommonModule, UnderConstructionModule],
  exports: [TransparencyGraphComponent],
})
export class TransparencyGraphModule {}
