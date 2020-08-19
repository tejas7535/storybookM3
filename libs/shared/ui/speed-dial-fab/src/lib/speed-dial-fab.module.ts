import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { IconsModule } from '@schaeffler/icons';

import { SpeedDialFabComponent } from './speed-dial-fab.component';

@NgModule({
  imports: [CommonModule, MatButtonModule, IconsModule, MatIconModule],
  declarations: [SpeedDialFabComponent],
  exports: [SpeedDialFabComponent],
})
export class SpeedDialFabModule {}
