import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsItemComponent } from './components/breadcrumbs-item/breadcrumbs-item.component';
import { BreadcrumbsMenuItemComponent } from './components/breadcrumbs-menu-item/breadcrumbs-menu-item.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    BreadcrumbsComponent,
    BreadcrumbsItemComponent,
    BreadcrumbsMenuItemComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  exports: [BreadcrumbsComponent],
})
export class BreadcrumbsModule {}
