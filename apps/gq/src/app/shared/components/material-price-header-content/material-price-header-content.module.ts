import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedPipesModule } from '../../pipes/shared-pipes.module';
import { MaterialPriceHeaderContentComponent } from './material-price-header-content.component';

@NgModule({
  declarations: [MaterialPriceHeaderContentComponent],
  imports: [CommonModule, SharedTranslocoModule, SharedPipesModule],
  exports: [MaterialPriceHeaderContentComponent],
})
export class MaterialPriceHeaderContentModule {}
