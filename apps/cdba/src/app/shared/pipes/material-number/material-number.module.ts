import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MaterialNumberPipe } from './material-number.pipe';
import { ScrambleMaterialNumberPipe } from './scramble-material-number.pipe';
import { ScrambleMaterialDesignationPipe } from './scramble-material-designation.pipe';

@NgModule({
  declarations: [
    MaterialNumberPipe,
    ScrambleMaterialNumberPipe,
    ScrambleMaterialDesignationPipe,
  ],
  imports: [CommonModule],
  providers: [ScrambleMaterialNumberPipe, ScrambleMaterialDesignationPipe],
  exports: [
    MaterialNumberPipe,
    ScrambleMaterialNumberPipe,
    ScrambleMaterialDesignationPipe,
  ],
})
export class MaterialNumberModule {}
