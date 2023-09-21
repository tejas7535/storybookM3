import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

import { FreeStockTrafficLightComponent } from '@gq/shared/components/free-stock-traffic-light/free-stock-traffic-light.component';
import { SharedDirectivesModule } from '@gq/shared/directives/shared-directives.module';
import { SharedPipesModule } from '@gq/shared/pipes/shared-pipes.module';
import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import {
  CreateCaseActionCellComponent,
  CreateCaseActionHeaderComponent,
  PricingAssistantActionCellComponent,
  ProcessCaseActionCellComponent,
  ProcessCaseActionHeaderComponent,
} from './action-cells';
import {
  EditCaseMaterialComponent,
  EditCellComponent,
  EditCommentComponent,
} from './edit-cells';
import { FreeStockCellComponent } from './free-stock/free-stock-cell/free-stock-cell.component';
import { GqIdComponent } from './gq-id/gq-id.component';
import { GqPriceCellComponent } from './gq-price-cell/gq-price-cell.component';
import { GqRatingComponent } from './gq-rating/gq-rating.component';
import { InfoCellComponent } from './info-cell/info-cell.component';
import { PositionIdComponent } from './position-id/position-id.component';
import { QuotationStatusCellComponent } from './quotation-status-cell/quotation-status-cell.component';
import { SapPriceCellComponent } from './sap-price-cell/sap-price-cell.component';
import { SapStatusCellComponent } from './sap-sync-status-cell/sap-sync-status-cell.component';
@NgModule({
  declarations: [
    ProcessCaseActionCellComponent,
    ProcessCaseActionHeaderComponent,
    CreateCaseActionHeaderComponent,
    CreateCaseActionCellComponent,
    PricingAssistantActionCellComponent,
    InfoCellComponent,
    GqRatingComponent,
    PositionIdComponent,
    GqIdComponent,
    GqPriceCellComponent,
    EditCommentComponent,
    EditCellComponent,
    SapStatusCellComponent,
    QuotationStatusCellComponent,
    FreeStockCellComponent,
    SapPriceCellComponent,
  ],
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatInputModule,
    MatTooltipModule,
    MatButtonModule,
    ReactiveFormsModule,
    PushPipe,
    FreeStockTrafficLightComponent,
    SharedTranslocoModule,
    EditCaseMaterialComponent,
    SharedDirectivesModule,
    SharedPipesModule,
  ],
  exports: [
    ProcessCaseActionCellComponent,
    ProcessCaseActionHeaderComponent,
    CreateCaseActionHeaderComponent,
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
