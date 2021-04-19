import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { ReactiveComponentModule } from '@ngrx/component';

import { ResultPageComponent } from './result-page.component';

@NgModule({
  declarations: [ResultPageComponent],
  imports: [CommonModule, MatButtonModule, ReactiveComponentModule],
  exports: [ResultPageComponent],
})
export class ResultPageModule {}
