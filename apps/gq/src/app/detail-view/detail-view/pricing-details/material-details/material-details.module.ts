import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../../../shared';
import { SharedPipesModule } from '../../../../shared/pipes/shared-pipes.module';
import { MaterialDetailsComponent } from './material-details.component';

@NgModule({
  declarations: [MaterialDetailsComponent],
  imports: [SharedModule, SharedTranslocoModule, SharedPipesModule],
  exports: [MaterialDetailsComponent],
})
export class MaterialDetailsModule {}
