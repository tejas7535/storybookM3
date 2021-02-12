import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ActionCellComponent } from './action-cell/action-cell.component';
import { GqRatingComponent } from './gq-rating/gq-rating.component';
import { InfoCellComponent } from './info-cell/info-cell.component';
import { OfferCartCellComponent } from './offer-cart-cell/offer-cart-cell.component';

@NgModule({
  declarations: [
    ActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    OfferCartCellComponent,
  ],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [
    ActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    OfferCartCellComponent,
  ],
})
export class CellRendererModule {}
