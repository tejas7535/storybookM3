import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MmNumberPipe } from './pipes/mm-number.pipe';

@NgModule({
  imports: [CommonModule, MatCardModule],
  exports: [CommonModule, MmNumberPipe],
  declarations: [MmNumberPipe],
})
export class SharedModule {}
