import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../shared';
import { MaterialDetailsComponent } from './material-details.component';

@NgModule({
  declarations: [MaterialDetailsComponent],
  imports: [SharedModule, SharedTranslocoModule],
  exports: [MaterialDetailsComponent],
})
export class MaterialDetailsModule {}
