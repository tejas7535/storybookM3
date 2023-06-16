import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';

import { LetDirective } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionListComponent } from './bearing-selection-list.component';

@NgModule({
  declarations: [BearingSelectionListComponent],
  imports: [
    CommonModule,
    LetDirective,

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
