import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';

import { PushModule } from '@ngrx/component';

import { FreeStockTrafficLightComponent } from '../../components/free-stock-traffic-light/free-stock-traffic-light.component';
import { CreateCaseActionCellComponent } from './action-cells/create-case-action-cell/create-case-action-cell.component';
import { ProcessCaseActionCellComponent } from './action-cells/process-case-action-cell/process-case-action-cell.component';
import { EditCellComponent } from './edit-cells/edit-cell/edit-cell.component';
import { EditCommentComponent } from './edit-cells/edit-comment/edit-comment.component';
import { FreeStockCellComponent } from './free-stock/free-stock-cell/free-stock-cell.component';
import { GqIdComponent } from './gq-id/gq-id.component';
import { GqRatingComponent } from './gq-rating/gq-rating.component';
import { InfoCellComponent } from './info-cell/info-cell.component';
import { PositionIdComponent } from './position-id/position-id.component';
import { SapStatusCellComponent } from './sap-sync-status-cell/sap-sync-status-cell.component';

@NgModule({
  declarations: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    PositionIdComponent,
    GqIdComponent,
    EditCommentComponent,
    EditCellComponent,
    SapStatusCellComponent,
    FreeStockCellComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    ReactiveFormsModule,
    PushModule,
    FreeStockTrafficLightComponent,
  ],
  exports: [
    ProcessCaseActionCellComponent,
    CreateCaseActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    PositionIdComponent,
    GqIdComponent,
    EditCommentComponent,
    FreeStockCellComponent,
  ],
})
export class CellRendererModule {}
