import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { ToggleSplitTypeButtonComponent } from './toggle-split-type-button.component';

@NgModule({
  declarations: [ToggleSplitTypeButtonComponent],
  imports: [CommonModule, MatButtonModule, SharedTranslocoModule],
  exports: [ToggleSplitTypeButtonComponent],
})
export class ToggleSplitTypeButtonModule {}
