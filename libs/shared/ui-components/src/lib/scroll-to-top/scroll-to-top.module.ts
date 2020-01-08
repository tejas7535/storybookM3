import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScrollToTopComponent } from './scroll-to-top.component';

@NgModule({
  declarations: [ScrollToTopComponent],
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    BrowserAnimationsModule
  ],
  exports: [ScrollToTopComponent]
})
export class ScrollToTopModule {}
