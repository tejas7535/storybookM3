import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

import { PushPipe } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RangeFilterModule } from '@ga/shared/components/range-filter';

import { AdvancedBearingSelectionService } from '../../services/advanced-bearing-selection.service';
import {
  BearingSelectionButtonComponent,
  BearingSelectionFiltersSummaryModule,
  BearingSelectionListModule,
} from '..';
import { AdvancedBearingSelectionComponent } from './advanced-bearing-selection.component';

@NgModule({
  declarations: [AdvancedBearingSelectionComponent],
  imports: [
    CommonModule,
    PushPipe,

    // Transloco
    SharedTranslocoModule,

    // Material Modules
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,

    // Shared Components
    RangeFilterModule,

    // Components
    BearingSelectionListModule,
    BearingSelectionFiltersSummaryModule,
    BearingSelectionButtonComponent,
  ],
  providers: [AdvancedBearingSelectionService],
  exports: [AdvancedBearingSelectionComponent],
})
export class AdvancedBearingSelectionModule {}
