import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { LetModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionListComponent } from './bearing-selection-list.component';

@NgModule({
  declarations: [BearingSelectionListComponent],
  imports: [
    CommonModule,
    LetModule,

    // Material Modules
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,

    // Transloco
    SharedTranslocoModule,
  ],
  exports: [BearingSelectionListComponent],
})
export class BearingSelectionListModule {}
