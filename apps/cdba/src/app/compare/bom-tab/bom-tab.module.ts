import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

// tslint:disable-next-line: nx-enforce-module-boundaries
import { UnderConstructionModule } from '@schaeffler/empty-states';

import { BomTabComponent } from './bom-tab.component';

@NgModule({
  declarations: [BomTabComponent],
  imports: [CommonModule, UnderConstructionModule],
  exports: [BomTabComponent],
})
export class BomTabModule {}
