import { NgModule } from '@angular/core';

import { DetailsTabComponent } from './details-tab.component';
import { DetailsTabRoutingModule } from './details-tab.routing.module';
import { MaterialCardModule } from './material-card/material-card.module';

@NgModule({
  declarations: [DetailsTabComponent],
  imports: [DetailsTabRoutingModule, MaterialCardModule],
  exports: [DetailsTabComponent],
})
export class DetailsTabModule {}
