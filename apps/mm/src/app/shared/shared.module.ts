import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

import { MagneticSliderCardComponent } from './components/magnetic-slider/magnetic-slider-card/magnetic-slider-card.component';
import { MagneticSliderComponent } from './components/magnetic-slider/magnetic-slider/magnetic-slider.component';
import { MmNumberPipe } from './pipes/mm-number.pipe';

@NgModule({
  imports: [CommonModule, MatCardModule],
  exports: [
    CommonModule,
    MagneticSliderComponent,
    MagneticSliderCardComponent,
    MmNumberPipe,
  ],
  declarations: [
    MagneticSliderComponent,
    MagneticSliderCardComponent,
    MmNumberPipe,
  ],
})
export class SharedModule {}
