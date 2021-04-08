import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UndefinedAttributeFallbackPipe } from './undefined-attribute-fallback.pipe';

@NgModule({
  declarations: [UndefinedAttributeFallbackPipe],
  imports: [CommonModule],
  exports: [UndefinedAttributeFallbackPipe],
})
export class UndefinedAttributeFallbackModule {}
