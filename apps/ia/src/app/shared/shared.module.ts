import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LetDirective, PushPipe } from '@ngrx/component';

@NgModule({
  imports: [CommonModule, LetDirective, PushPipe],
  exports: [CommonModule, LetDirective, PushPipe],
})
export class SharedModule {}
