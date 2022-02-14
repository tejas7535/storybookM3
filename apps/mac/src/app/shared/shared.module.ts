import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

@NgModule({
  imports: [CommonModule, MatIconModule, RouterModule],
  exports: [CommonModule, BreadcrumbsComponent],
  declarations: [BreadcrumbsComponent],
})
export class SharedModule {}
