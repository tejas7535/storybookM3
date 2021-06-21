import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { ReactiveComponentModule } from '@ngrx/component';

import { CreateCaseActionCellComponent } from './action-cells/create-case-action-cell/create-case-action-cell.component';
import { ProcessCaseActionCellComponent } from './action-cells/process-case-action-cell/process-case-action-cell.component';
import { EditPriceComponent } from './edit-price/edit-price.component';
import { EditQuantityComponent } from './edit-quantity/edit-quantity.component';
import { EditingPriceComponent } from './editing-price/editing-price.component';
import { EditingQuantityComponent } from './editing-quantity/editing-quantity.component';
import { GqIdComponent } from './gq-id/gq-id.component';
import { GqRatingComponent } from './gq-rating/gq-rating.component';
import { InfoCellComponent } from './info-cell/info-cell.component';
import { PositionIdComponent } from './position-id/position-id.component';

@NgModule({
  declarations: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    EditPriceComponent,
    EditingPriceComponent,
    EditQuantityComponent,
    EditingQuantityComponent,
    PositionIdComponent,
    GqIdComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    ReactiveComponentModule,
  ],
  exports: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    EditPriceComponent,
    EditingPriceComponent,
    EditQuantityComponent,
    EditingQuantityComponent,
    PositionIdComponent,
    GqIdComponent,
  ],
})
export class CellRendererModule {}
