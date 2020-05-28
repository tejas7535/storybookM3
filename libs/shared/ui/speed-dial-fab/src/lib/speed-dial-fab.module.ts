import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { SpeedDialFabComponent } from './speed-dial-fab.component';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [SpeedDialFabComponent],
  exports: [SpeedDialFabComponent],
})
export class SpeedDialFabModule {}
