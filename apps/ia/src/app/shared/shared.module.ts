import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LetModule, PushModule } from '@ngrx/component';

@NgModule({
  imports: [CommonModule, LetModule, PushModule],
  exports: [CommonModule, LetModule, PushModule],
})
export class SharedModule {}
