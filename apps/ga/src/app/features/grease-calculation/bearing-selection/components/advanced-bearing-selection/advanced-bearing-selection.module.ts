import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';

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
