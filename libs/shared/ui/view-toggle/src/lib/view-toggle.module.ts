import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';

import { ViewToggleComponent } from './components/view-toggle/view-toggle.component';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule, MatIconModule],
  declarations: [ViewToggleComponent],
  exports: [ViewToggleComponent],
})
export class ViewToggleModule {}
