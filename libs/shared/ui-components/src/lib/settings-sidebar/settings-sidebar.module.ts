import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

import { IconModule } from '../icon/icon.module';

import { SettingsSidebarComponent } from './settings-sidebar.component';

import { HammerConfig } from './config/hammer-config';

@NgModule({
  declarations: [SettingsSidebarComponent],
  imports: [
    CommonModule,
    IconModule,
    FlexLayoutModule,
    MatButtonModule,
    MatSidenavModule
  ],
  providers: [
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: HammerConfig
    }
  ],
  exports: [SettingsSidebarComponent]
})
export class SettingsSidebarModule {}
