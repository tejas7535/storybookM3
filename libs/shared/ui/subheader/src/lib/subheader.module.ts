import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SubheaderComponent } from './subheader.component';

@NgModule({
  imports: [CommonModule, MatIconModule],
  declarations: [SubheaderComponent],
  exports: [SubheaderComponent],
})
export class SubheaderModule {}
