import { NgModule } from '@angular/core';

import { InViewDirective } from './in-view.directive';

@NgModule({
  declarations: [InViewDirective],
  exports: [InViewDirective],
})
export class InViewModule {}
