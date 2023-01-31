import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DisableOnProdDirective } from './disable-on-prod/disable-on-prod.directive';

@NgModule({
  declarations: [DisableOnProdDirective],
  imports: [CommonModule],
  exports: [DisableOnProdDirective],
})
export class SharedDirectivesModule {}
