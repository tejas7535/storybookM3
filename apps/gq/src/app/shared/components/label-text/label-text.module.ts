import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InfoIconComponent } from '../info-icon/info-icon.component';
import { LabelTextComponent } from './label-text.component';

@NgModule({
  declarations: [LabelTextComponent],
  imports: [CommonModule, InfoIconComponent],
  exports: [LabelTextComponent],
})
export class LabelTextModule {}
