import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../..';
import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { MaterialPriceHeaderContentComponent } from './material-price-header-content.component';

@NgModule({
  declarations: [MaterialPriceHeaderContentComponent],
  imports: [SharedModule, SharedTranslocoModule, SharedPipesModule],
  exports: [MaterialPriceHeaderContentComponent],
})
export class MaterialPriceHeaderContentModule {}
