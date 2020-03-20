import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';

import { IconModule } from '../icon/icon.module';

import { SettingsSidebarComponent } from './settings-sidebar.component';

@NgModule({
  declarations: [SettingsSidebarComponent],
  imports: [
    CommonModule,
    IconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSidenavModule
  ],
  exports: [SettingsSidebarComponent]
})
export class SettingsSidebarModule {}
