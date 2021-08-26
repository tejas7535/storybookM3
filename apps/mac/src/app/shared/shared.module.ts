import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';

@NgModule({
  imports: [CommonModule, FlexLayoutModule, MatIconModule, RouterModule],
  exports: [CommonModule, FlexLayoutModule, BreadcrumbsComponent],
  declarations: [BreadcrumbsComponent],
})
export class SharedModule {}
