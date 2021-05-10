import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PictureCardModule } from '@schaeffler/picture-card';

import { MagneticSliderComponent } from '../shared/components/magnetic-slider/magnetic-slider.component';
import { PictureCardListComponent } from './picture-card-list.component';

@NgModule({
  declarations: [PictureCardListComponent, MagneticSliderComponent],
  imports: [CommonModule, PictureCardModule],
  exports: [PictureCardListComponent, MagneticSliderComponent],
})
export class PictureCardListModule {}
