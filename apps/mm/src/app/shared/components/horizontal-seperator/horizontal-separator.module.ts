import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { HorizontalSeparatorComponent } from './horizontal-separator.component';

@NgModule({
  imports: [CommonModule],
  declarations: [HorizontalSeparatorComponent],
  exports: [HorizontalSeparatorComponent],
})
export class HorizontalSeparatorModule {}
