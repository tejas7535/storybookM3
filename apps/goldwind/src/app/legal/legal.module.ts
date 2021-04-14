import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal.component';

@NgModule({
  declarations: [LegalComponent],
  imports: [LegalRoutingModule, SharedModule],
})
export class LegalModule {}
