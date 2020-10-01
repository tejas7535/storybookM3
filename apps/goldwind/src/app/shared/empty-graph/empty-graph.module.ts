import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import { SharedTranslocoModule } from '@schaeffler/transloco';

import { SharedModule } from '../../shared/shared.module';
import { EmptyGraphComponent } from './empty-graph.component';

@NgModule({
  declarations: [EmptyGraphComponent],
  imports: [
    CommonModule,
    SharedModule,

    // UI Modules
    MatIconModule,

    // Translation
    SharedTranslocoModule,
  ],
  exports: [EmptyGraphComponent],
})
export class EmptyGraphModule {}
