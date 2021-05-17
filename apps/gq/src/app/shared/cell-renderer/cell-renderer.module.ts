import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { CreateCaseActionCellComponent } from './action-cells/create-case-action-cell/create-case-action-cell.component';
import { ProcessCaseActionCellComponent } from './action-cells/process-case-action-cell/process-case-action-cell.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import { EditingPriceComponent } from './editing-price/editing-price.component';
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
    EditPriceComponent,
    EditingPriceComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  exports: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    OfferCartCellComponent,
    EditPriceComponent,
    EditingPriceComponent,
  ],
})
export class CellRendererModule {}
