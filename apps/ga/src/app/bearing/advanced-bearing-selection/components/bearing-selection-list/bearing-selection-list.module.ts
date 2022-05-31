import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

import { ReactiveComponentModule } from '@ngrx/component';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { BearingSelectionListComponent } from './bearing-selection-list.component';

@NgModule({
  declarations: [BearingSelectionListComponent],
  imports: [
    CommonModule,
    ReactiveComponentModule,

    // Material Modules
    MatIconModule,
    MatListModule,

    // Transloco
    SharedTranslocoModule,
  ],
  exports: [BearingSelectionListComponent],
})
export class BearingSelectionListModule {}
