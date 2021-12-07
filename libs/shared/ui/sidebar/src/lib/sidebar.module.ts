import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { ReactiveComponentModule } from '@ngrx/component';

import { SidebarComponent } from './sidebar.component';
import { SidebarElementsComponent } from './sidebar-elements/sidebar-elements.component';
import { StoreModule } from './store/store.module';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    RouterModule,
    FlexLayoutModule,
    StoreModule,
    ReactiveComponentModule,
  ],
  declarations: [SidebarComponent, SidebarElementsComponent],
  exports: [SidebarComponent, SidebarElementsComponent],
})
export class SidebarModule {}
