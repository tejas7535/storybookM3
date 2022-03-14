import { NgModule } from '@angular/core';

import { ResizableWidthDirective } from './resizable-width.directive';

@NgModule({
  declarations: [ResizableWidthDirective],
  exports: [ResizableWidthDirective],
})
export class ResizeModule {}
