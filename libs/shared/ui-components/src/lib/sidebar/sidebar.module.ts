import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { IconModule } from '../icon/icon.module';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    IconModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    RouterModule,
    FlexLayoutModule
  ],
  declarations: [SidebarComponent],
  exports: [MatSidenavModule, SidebarComponent]
})
export class SidebarModule {}
