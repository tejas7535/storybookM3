import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { GhostLineElementsComponent } from './ghost-line-elements.component';

@NgModule({
  declarations: [GhostLineElementsComponent],
  imports: [CommonModule],
  exports: [GhostLineElementsComponent]
})
export class GhostLineElementsModule {}
