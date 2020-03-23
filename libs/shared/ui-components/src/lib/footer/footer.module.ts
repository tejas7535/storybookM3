import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './footer.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, RouterModule],
  declarations: [FooterComponent],
  exports: [FooterComponent]
})
export class FooterModule {}
