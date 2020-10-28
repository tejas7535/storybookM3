import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SensorComponent } from './sensor.component';

@NgModule({
  declarations: [SensorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,

    // UI Modules
    MatSlideToggleModule,

    // Translation
    SharedTranslocoModule,
  ],
  exports: [SensorComponent],
})
export class SensorModule {}
