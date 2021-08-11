import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '@cdba/shared';
import { UndefinedAttributeFallbackModule } from '@cdba/shared/pipes';

import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
