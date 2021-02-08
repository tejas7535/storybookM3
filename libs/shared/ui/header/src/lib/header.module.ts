import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';

import { BreakpointService } from '@schaeffler/responsive';

import { HeaderComponent } from './header.component';
import { UserMenuComponent } from './user-menu/user-menu.component';
import { UserMenuModule } from './user-menu/user-menu.module';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    FlexLayoutModule,
    RouterModule,
    UserMenuModule,
  ],
  providers: [BreakpointService],
  declarations: [HeaderComponent],
  exports: [HeaderComponent, UserMenuComponent],
})
export class HeaderModule {}
