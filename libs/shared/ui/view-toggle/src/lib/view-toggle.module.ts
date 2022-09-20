import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { ViewToggleComponent } from './components/view-toggle/view-toggle.component';

@NgModule({
  imports: [CommonModule, MatButtonToggleModule],
  declarations: [ViewToggleComponent],
  exports: [ViewToggleComponent],
})
export class ViewToggleModule {}
