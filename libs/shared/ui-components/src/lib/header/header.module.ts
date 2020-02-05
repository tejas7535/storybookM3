import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';

import { HeaderComponent } from './header.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

import { BreakpointService } from '@schaeffler/shared/responsive';

@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    FlexLayoutModule
  ],
  providers: [BreakpointService],
  declarations: [HeaderComponent, UserMenuComponent],
  exports: [HeaderComponent, UserMenuComponent]
})
export class HeaderModule {}
