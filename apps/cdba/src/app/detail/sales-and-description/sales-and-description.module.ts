import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { SalesAndDescriptionComponent } from './sales-and-description.component';

@NgModule({
  declarations: [SalesAndDescriptionComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [SalesAndDescriptionComponent],
})
export class SalesAndDescriptionModule {}
