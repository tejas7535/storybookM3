import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveComponentModule } from '@ngrx/component';

@NgModule({
  imports: [CommonModule, ReactiveComponentModule],
  exports: [CommonModule, ReactiveComponentModule],
})
export class SharedModule {}
