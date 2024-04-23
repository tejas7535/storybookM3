import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { StarRatingComponent } from './star-rating.component';

@NgModule({
  declarations: [StarRatingComponent],
  imports: [CommonModule, MatIconModule],
  exports: [StarRatingComponent],
})
export class StarRatingModule {}
