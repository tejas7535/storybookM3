import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CreateCaseActionCellComponent } from './action-cells/create-case-action-cell/create-case-action-cell.component';
import { ProcessCaseActionCellComponent } from './action-cells/process-case-action-cell/process-case-action-cell.component';
import { GqRatingComponent } from './gq-rating/gq-rating.component';
import { InfoCellComponent } from './info-cell/info-cell.component';
import { OfferCartCellComponent } from './offer-cart-cell/offer-cart-cell.component';

@NgModule({
  declarations: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    OfferCartCellComponent,
  ],
  imports: [CommonModule, MatIconModule, MatTooltipModule],
  exports: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    OfferCartCellComponent,
  ],
})
export class CellRendererModule {}
