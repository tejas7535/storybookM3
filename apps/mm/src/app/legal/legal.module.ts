import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SubheaderModule } from '@schaeffler/subheader';
import { SharedTranslocoModule } from '@schaeffler/transloco';

import { LegalRoutingModule } from './legal-routing.module';
import { LegalComponent } from './legal.component';

@NgModule({
  declarations: [LegalComponent],
  imports: [
    LegalRoutingModule,
    CommonModule,
    SubheaderModule,
    SharedTranslocoModule,
  ],
})
export class LegalModule {}
