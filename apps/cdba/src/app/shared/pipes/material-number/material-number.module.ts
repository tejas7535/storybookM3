import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialNumberPipe } from './material-number.pipe';

@NgModule({
  declarations: [MaterialNumberPipe],
  imports: [CommonModule],
  exports: [MaterialNumberPipe],
})
export class MaterialNumberModule {}
