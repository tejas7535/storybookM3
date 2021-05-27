import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { DialogHeaderComponent } from './dialog-header.component';

@NgModule({
  declarations: [DialogHeaderComponent],
  imports: [CommonModule, MatIconModule],
  exports: [DialogHeaderComponent],
})
export class DialogHeaderModule {}
