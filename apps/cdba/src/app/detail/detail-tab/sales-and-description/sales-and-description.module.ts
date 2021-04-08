import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  MaterialNumberModule,
  UndefinedAttributeFallbackModule,
} from '../../../shared/pipes';
import { SharedModule } from '../../../shared/shared.module';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [
    SharedModule,
    SharedTranslocoModule,
    MaterialNumberModule,
    UndefinedAttributeFallbackModule,
  ],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
