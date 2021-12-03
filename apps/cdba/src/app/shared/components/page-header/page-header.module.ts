import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { BackButtonModule } from '@cdba/shared/directives/back-button';

import { PageHeaderComponent } from './page-header.component';

@NgModule({
  declarations: [PageHeaderComponent],
  imports: [CommonModule, RouterModule, MatIconModule, BackButtonModule],
  exports: [PageHeaderComponent],
})
export class PageHeaderModule {}
