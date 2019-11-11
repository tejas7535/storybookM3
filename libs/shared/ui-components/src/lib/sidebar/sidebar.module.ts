import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TranslocoModule } from '@ngneat/transloco';

import { SidebarComponent } from './sidebar.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    MatSidenavModule,
    MatListModule,
    MatTooltipModule,
    MatIconModule,
    RouterModule,
    FlexLayoutModule,
    TranslocoModule
  ],
  declarations: [SidebarComponent],
  exports: [MatSidenavModule, SidebarComponent]
})
export class SidebarModule {}
