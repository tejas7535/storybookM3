import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './components/breadcrumbs/breadcrumbs.component';
import { BreadcrumbsItemComponent } from './components/breadcrumbs-item/breadcrumbs-item.component';
import { BreadcrumbsMenuItemComponent } from './components/breadcrumbs-menu-item/breadcrumbs-menu-item.component';

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
