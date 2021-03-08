import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnderConstructionModule } from '@schaeffler/empty-states';

import { DetailsTabComponent } from './details-tab.component';

@NgModule({
  declarations: [DetailsTabComponent],
  imports: [CommonModule, UnderConstructionModule],
  exports: [DetailsTabComponent],
})
export class DetailsTabModule {}
