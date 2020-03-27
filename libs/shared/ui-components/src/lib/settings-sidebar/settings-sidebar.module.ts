import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';

import { SettingsSidebarComponent } from './settings-sidebar.component';

@NgModule({
  declarations: [SettingsSidebarComponent],
  imports: [
    CommonModule,
    MatIconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSidenavModule
  ],
  exports: [SettingsSidebarComponent]
})
export class SettingsSidebarModule {}
