import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { PushModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { RangeFilterModule } from '@ga/shared/components/range-filter';

import { AdvancedBearingSelectionComponent } from './advanced-bearing-selection.component';
import {
  BearingSelectionButtonComponent,
  BearingSelectionFiltersSummaryModule,
  BearingSelectionListModule,
} from '..';
import { AdvancedBearingSelectionService } from '../../services/advanced-bearing-selection.service';

@NgModule({
  declarations: [AdvancedBearingSelectionComponent],
  imports: [
    CommonModule,
    PushModule,

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
