import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { BreakpointService } from '../breakpoint-service/breakpoint.service';
import { HeaderComponent } from './header.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    FlexLayoutModule,
    BrowserModule,
    BrowserAnimationsModule
  ],
  providers: [BreakpointService],
  declarations: [HeaderComponent, UserMenuComponent],
  exports: [HeaderComponent, UserMenuComponent]
})
export class HeaderModule {}
