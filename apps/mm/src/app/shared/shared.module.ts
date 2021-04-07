import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MagneticSliderCardComponent } from './components/magnetic-slider/magnetic-slider-card/magnetic-slider-card.component';
import { MagneticSliderComponent } from './components/magnetic-slider/magnetic-slider/magnetic-slider.component';

@NgModule({
  imports: [CommonModule, MatCardModule],
  exports: [CommonModule, MagneticSliderComponent, MagneticSliderCardComponent],
  declarations: [MagneticSliderComponent, MagneticSliderCardComponent],
})
export class SharedModule {}
