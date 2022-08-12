import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InfoIconModule } from '../info-icon/info-icon.module';
import { LabelTextComponent } from './label-text.component';

@NgModule({
  declarations: [LabelTextComponent],
  imports: [CommonModule, InfoIconModule],
  exports: [LabelTextComponent],
})
export class LabelTextModule {}
