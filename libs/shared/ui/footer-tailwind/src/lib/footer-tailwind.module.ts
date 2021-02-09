import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';

import { FooterTailwindComponent } from './footer-tailwind.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, RouterModule, MatButtonModule],
  declarations: [FooterTailwindComponent],
  exports: [FooterTailwindComponent],
})
export class FooterTailwindModule {}
