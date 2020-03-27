import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
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
