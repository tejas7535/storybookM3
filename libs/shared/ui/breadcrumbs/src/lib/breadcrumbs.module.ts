import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './breadcrumbs.component';

@NgModule({
  declarations: [BreadcrumbsComponent],
  imports: [CommonModule, MatIconModule, RouterModule],
  exports: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {}
