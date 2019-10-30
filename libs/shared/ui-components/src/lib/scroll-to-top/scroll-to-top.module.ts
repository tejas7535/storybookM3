import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ScrollToTopComponent } from './scroll-to-top.component';

@NgModule({
  declarations: [ScrollToTopComponent],
  imports: [CommonModule, MatIconModule, BrowserAnimationsModule],
  exports: [ScrollToTopComponent]
})
export class ScrollToTopModule {}
